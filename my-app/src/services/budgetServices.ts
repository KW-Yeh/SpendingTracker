const URL = '/api/aurora/budgets';

export const getBudget = async (
  accountId: number,
): Promise<{
  status: boolean;
  data: Budget | null;
  message: string;
}> => {
  try {
    if (!accountId) {
      return { status: false, data: null, message: '缺少帳本 ID' };
    }

    const data = await fetch(`${URL}?account_id=${accountId}`).then((res) =>
      res.json(),
    );

    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: null, message: '發生不預期的錯誤' };
  }
};

export const putBudget = async (data: {
  budget_id?: number;
  account_id: number;
  annual_budget: number;
  monthly_items: MonthlyBudgetItem[];
}): Promise<{
  status: boolean;
  data?: Budget;
  message: string;
}> => {
  try {
    const result = await fetch(URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    return { status: true, data: result, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};

export const deleteBudget = async (
  accountId: number,
): Promise<{
  status: boolean;
  message: string;
}> => {
  try {
    await fetch(`${URL}?account_id=${accountId}`, {
      method: 'DELETE',
    });

    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};
