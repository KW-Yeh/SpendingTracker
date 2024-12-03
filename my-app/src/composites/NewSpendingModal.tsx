"use client";

import { InputBox } from "@/components/InputBox";

export const NewSpendingModal = () => {
  const handleSubmit = () => {
    console.log("handleSubmit");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-1 w-full items-center gap-6"
    >
      <h1 className="font-bold text-xl">新增支出 / 收入</h1>
      <div className="flex flex-col gap-3 md:w-fit w-full">
        <InputBox label="日期" type="date" name="date" />
        <fieldset className="border border-solid border-text rounded-lg px-2 pb-1">
          <legend className="px-2 bg-background">類別</legend>
          <select name="category" className="bg-transparent w-full">
            <optgroup label="支出類別">
              <option value="飲食">飲食</option>
              <option value="日常">日常</option>
              <option value="交通">交通</option>
              <option value="娛樂">娛樂</option>
              <option value="醫療">醫療</option>
              <option value="代墊">代墊</option>
              <option value="投資">投資</option>
            </optgroup>
            <optgroup label="收入類別">
              <option value="還款">還款</option>
              <option value="股息">股息</option>
              <option value="獎金">獎金</option>
              <option value="薪水">薪水</option>
            </optgroup>
            <optgroup label="其他">
              <option value="Other">其他</option>
            </optgroup>
          </select>
        </fieldset>
        <InputBox label="金額" type="number" name="cost" />
        <InputBox label="說明" type="text" name="desc" />
      </div>
    </form>
  );
};
