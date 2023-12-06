import React, { useState } from "react";
import useAddTransaction from "../../hooks/useAddTransaction";
import useGetTransaction from "../../hooks/useGetTransaction";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { MdOutlineDelete } from "react-icons/md";
import { db } from "../../config/firebase";
import { deleteDoc, collection, doc } from "firebase/firestore";

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransaction();
  const { name, profilePhoto } = useGetUserInfo();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const { balance, income, expenses } = transactionTotals;

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    });
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteExpense = async (index) => {
    const data = await deleteDoc(doc(db, "transactions", index));
  };

  return (
    <div className=" mx-auto w-90% max-w-maxContent font-inter relative">
      <div
        className="flex justify-center items-center text-richblue-900  
    mt-10 font-bold text-6xl cursor-default w-full"
      >
        <p>Expense Tracker</p>
      </div>

      <h1 className=" mt-5 text-4xl font-semibold text-center cursor-default text-richblue-900">
        {name}
      </h1>
      <div className="flex flex-col max-w-lg mx-auto mt-8">
        {/* form */}
        <div>
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Description"
              required
              onChange={(e) => setDescription(e.target.value)}
              className="mr-2 pl-1 rounded-md p-1 outline-richblack-300"
            />

            <input
              type="number"
              placeholder="Amount"
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
              className="mr-2 pl-1 rounded-md p-1 outline-richblack-300"
            />
            <div className="flex gap-8">
              <div>
                <input
                  type="radio"
                  id="expense"
                  value="expense"
                  checked={transactionType === "expense"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="expense"
                  className="mr-2 ml-1 text-lg font-semibold"
                >
                  Expense
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="income"
                  value="income"
                  checked={transactionType === "income"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="income"
                  className="mr-2 ml-1 text-lg font-semibold"
                >
                  Income
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-richblue-800 mt-3 text-richblue-5 py-2 px-4 rounded-2xl hover:bg-richblue-25 hover:border-2 hover:font-bold hover:text-richblue-800 transition-all duration-200"
            >
              {" "}
              Add Tansaction
            </button>
          </form>
        </div>

        <div className="flex flex-row justify-between mt-2">
          {/* Expenses */}
          <div className="mt-2 mb-4 cursor-default">
            <h4 className="font-bold text-2xl ">Expense</h4>
            <p className="ml-2 font-medium text-lg">${expenses}</p>
          </div>

          {/* summary */}
          <div className="mt-2 cursor-default">
            <h4 className="font-bold text-2xl "> Income</h4>
            <p className="ml-2 font-medium text-lg">${income}</p>
          </div>

          {/* balance */}
          <div className="mt-2 cursor-default">
            <h3 className="font-bold text-2xl ">Your Balance</h3>
            {balance >= 0 ? (
              <h2 className="ml-2 font-medium text-lg"> ${balance}</h2>
            ) : (
              <h2 className="ml-2 font-medium text-lg"> -${balance * -1}</h2>
            )}
          </div>
        </div>
        {/* ProfilePhoto */}
        <div className="ml-4 absolute -top-3 -right-20">
          {profilePhoto && (
            <div className="flex flex-col">
              <img
                src={profilePhoto}
                alt="profilePhoto"
                className="rounded-full mb-2 h-30 w-30"
              />
              <button
                onClick={signUserOut}
                className="bg-richblue-800 mt-3 text-richblue-5 py-2 rounded-2xl hover:bg-richblue-25 hover:border-2 hover:font-bold hover:text-richblue-800 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Transaction */}
      <div className="flex flex-col items-center justify-center mt-2 bg-richblack-100 w-[40%] mx-auto rounded-xl h-[235px]">
        <h2 className="font-bold text-3xl mt-2 mb-1 text-richblue-800 p-3">
          Transactions
        </h2>
        <ul className="mb-4 h-[200px] w-[80%] transactionList">
          {transactions.map((transaction, index) => {
            return (
              <li
                key={index}
                className="flex flex-row justify-between gap-16 items-center "
              >
                <h4 className="flex flex-col">
                  {transaction.description}
                  <p>
                    {" "}
                    ${transaction.transactionAmount}{" "}
                    <label
                      className={`${
                        transaction.transactionType === "expense"
                          ? "text-pink-900"
                          : "text-caribbeangreen-800"
                      } font-semibold`}
                    >
                      {transaction.transactionType}
                    </label>{" "}
                  </p>
                </h4>
                <div
                  className="cursor-pointer"
                  onClick={() => deleteExpense(transaction.id)}
                >
                  <MdOutlineDelete />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseTracker;
