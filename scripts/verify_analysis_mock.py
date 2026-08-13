from pathlib import Path

from playwright.sync_api import ConsoleMessage, Request, sync_playwright


OUTPUT_DIR = Path(__file__).parent / "artifacts" / "analysis"
VIEWPORTS = [375, 768, 1440]


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        for width in VIEWPORTS:
            console_errors: list[str] = []
            page_errors: list[str] = []
            failed_requests: list[str] = []
            analysis_requests: list[str] = []
            page = browser.new_page(viewport={"width": width, "height": 900})

            def on_console(message: ConsoleMessage) -> None:
                if message.type == "error":
                    console_errors.append(message.text)

            def on_request(request: Request) -> None:
                if "/api/aurora/items" in request.url:
                    analysis_requests.append(request.url)

            page.on("console", on_console)
            page.on("pageerror", lambda error: page_errors.append(str(error)))

            def on_request_failed(request: Request) -> None:
                failure = request.failure or "unknown failure"
                # Next.js cancels speculative RSC prefetches when a page closes.
                if "ERR_ABORTED" not in failure:
                    failed_requests.append(f"{request.url}: {failure}")

            page.on("requestfailed", on_request_failed)
            page.on("request", on_request)
            page.goto("http://localhost:3000/analysis?mock=1")
            page.wait_for_load_state("networkidle")
            page.get_by_text("Mock data 驗證模式", exact=True).wait_for()
            assert page.get_by_text("看懂錢花去哪裡", exact=True).count() == 0

            for label in ["本月支出", "較上月", "本月結餘", "預算使用率"]:
                assert page.get_by_text(label, exact=True).count() == 1, label

            for test_id in [
                "spending-trend-chart",
                "category-change-chart",
                "necessity-trend-chart",
                "budget-progress-list",
            ]:
                section = page.get_by_test_id(test_id)
                try:
                    section.wait_for()
                except Exception as error:
                    body_text = page.locator("body").inner_text()
                    raise AssertionError(
                        f"{test_id} did not render; console={console_errors}; "
                        f"page_errors={page_errors}; failed={failed_requests}; "
                        f"body={body_text[:2000]}"
                    ) from error

            for test_id in [
                "spending-trend-chart",
                "category-change-chart",
                "necessity-trend-chart",
            ]:
                assert page.get_by_test_id(test_id).locator("svg").count() > 0, test_id

            assert page.locator('[data-change-direction="increase"]').count() > 0
            assert page.locator('[data-change-direction="decrease"]').count() > 0
            assert page.locator('[data-budget-status="over"]').count() > 0

            if width == VIEWPORTS[0]:
                period = page.locator("p").filter(has_text="Mock 家庭帳本 ·").first
                initial_period = period.inner_text()
                page.get_by_role("button", name="上個月").click()
                page.wait_for_function(
                    "value => !document.body.innerText.includes(value)",
                    arg=initial_period,
                )
                assert period.inner_text() != initial_period
                page.get_by_role("button", name="下個月").click()
                page.wait_for_function(
                    "value => document.body.innerText.includes(value)",
                    arg=initial_period,
                )

            overflow = page.evaluate(
                "document.documentElement.scrollWidth > document.documentElement.clientWidth"
            )
            assert not overflow, f"horizontal overflow at {width}px"
            assert not analysis_requests, analysis_requests
            assert not console_errors, console_errors
            assert not page_errors, page_errors
            assert not failed_requests, failed_requests

            page.screenshot(
                path=str(OUTPUT_DIR / f"analysis-{width}.png"), full_page=True
            )
            page.close()

        browser.close()

    print("analysis mock verification passed at 375, 768, and 1440px")


if __name__ == "__main__":
    main()
