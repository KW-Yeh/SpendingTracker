"use client";

import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { WEEKDAY } from "@/utils/constants";
import { ChangeEvent, useRef } from "react";

interface Props {
	date: Date;
	onChange: (event: ChangeEvent) => void;
}

export const DatePicker = (props: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const year = props.date.getFullYear();
	const month = props.date.getMonth();
	const day = props.date.getDate();
	const weekday = props.date.getDay();

	const showPicker = () => {
		if (!inputRef.current) return;
		inputRef.current.showPicker();
	};

	return (
		<div className="flex items-center">
			<button
				className="flex items-center justify-between gap-4 p-4 text-base sm:text-lg"
				onClick={showPicker}
			>
				<span>{`${year} 年 ${month} 月 ${day} 日 (週${WEEKDAY[weekday]})`}</span>
				<CalendarIcon className="size-4 sm:size-5"/>
			</button>
			<input
				ref={inputRef}
				type="date"
				className="hidden"
				onChange={props.onChange}
			/>
		</div>
	);
};
