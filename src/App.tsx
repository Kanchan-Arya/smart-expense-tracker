
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

const CATEGORY_COLORS = [
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#0ea5e9",
  "#8b5cf6",
];

type Transaction = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
};

type Income = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
};


type RecurringExpense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  frequency: "Weekly" | "Monthly";
  nextDueDate: string;
};


function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
  const savedTransactions = localStorage.getItem("smart-expense-transactions");

  if (savedTransactions) {
    try {
      return JSON.parse(savedTransactions) as Transaction[];
    } catch {
      return [];
    }
  }

  return [];
});
  const [title, setTitle] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  
const [incomes, setIncomes] = useState<Income[]>(() => {
  try {
    const saved = localStorage.getItem("smart-expense-incomes");
    return saved ? (JSON.parse(saved) as Income[]) : [];
  } catch {
    return [];
  }
});

const [incomeTitle, setIncomeTitle] = useState("");
const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
const [incomeAmount, setIncomeAmount] = useState("");
const [incomeCategory, setIncomeCategory] = useState("Salary");
const [incomeDate, setIncomeDate] = useState(
  new Date().toISOString().split("T")[0]
);

  
const [recurringExpenses, setRecurringExpenses] =
  useState<RecurringExpense[]>(() => {
    try {
      const saved = localStorage.getItem("smart-expense-recurring");
      return saved ? (JSON.parse(saved) as RecurringExpense[]) : [];
    } catch {
      return [];
    }
  });

const [recurringTitle, setRecurringTitle] = useState("");
const [recurringAmount, setRecurringAmount] = useState("");
const [recurringCategory, setRecurringCategory] = useState("Bills");
const [recurringFrequency, setRecurringFrequency] =
  useState<"Weekly" | "Monthly">("Monthly");
const [recurringDueDate, setRecurringDueDate] = useState(
  new Date().toISOString().split("T")[0]
);

  
const [editingId, setEditingId] = useState<number | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");

const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");


  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  
const [selectedMonth, setSelectedMonth] = useState(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
});

  
const [date, setDate] = useState(
  new Date().toISOString().split("T")[0]
);

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
  return Number(localStorage.getItem("smart-expense-budget")) || 10000;
});


const [savingsGoal, setSavingsGoal] = useState(() => {
  const saved = localStorage.getItem("smart-expense-savings-goal");
  return saved !== null ? Number(saved) : 5000;
});

const [amountSaved, setAmountSaved] = useState(() => {
  return Number(localStorage.getItem("smart-expense-amount-saved")) || 0;
});

  useEffect(() => {
  localStorage.setItem(
    "smart-expense-transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);

useEffect(() => {
  localStorage.setItem(
    "smart-expense-budget",
    String(monthlyBudget)
  );
}, [monthlyBudget]);


useEffect(() => {
  localStorage.setItem(
    "smart-expense-savings-goal",
    String(savingsGoal)
  );
}, [savingsGoal]);

useEffect(() => {
  localStorage.setItem(
    "smart-expense-amount-saved",
    String(amountSaved)
  );
}, [amountSaved]);

useEffect(() => {
  localStorage.setItem(
    "smart-expense-recurring",
    JSON.stringify(recurringExpenses)
  );
}, [recurringExpenses]);

useEffect(() => {
  localStorage.setItem(
    "smart-expense-incomes",
    JSON.stringify(incomes)
  );
}, [incomes]);


  function addTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!title.trim() || !amount || numericAmount <= 0) {
      alert("Please enter a description and an amount greater than zero.");
      return;
    }


if (editingId !== null) {
  setTransactions((current) =>
    current.map((transaction) =>
      transaction.id === editingId
        ? {
            ...transaction,
            title: title.trim(),
            amount: numericAmount,
            category,
            date,
            paymentMethod,
          }
        : transaction
    )
  );

  setEditingId(null);
} else {
  const newTransaction: Transaction = {
    id: Date.now(),
    title: title.trim(),
    amount: numericAmount,
    category,
    date,
    paymentMethod,
  };

  setTransactions((current) => [newTransaction, ...current]);
}

    setTitle("");
    setAmount("");
    setCategory("Food");
    setPaymentMethod("UPI");
    
setDate(new Date().toISOString().split("T")[0]);

  }

  
function deleteTransaction(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this expense?"
  );

  if (!confirmed) return;

  setTransactions((current) =>
    current.filter((transaction) => transaction.id !== id)
  );
}

function addRecurringExpense(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const numericAmount = Number(recurringAmount);

  if (
    !recurringTitle.trim() ||
    !recurringAmount ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0 ||
    !recurringDueDate
  ) {
    alert("Please enter a description, a valid amount, and a due date.");
    return;
  }

  const newRecurringExpense: RecurringExpense = {
    id: Date.now(),
    title: recurringTitle.trim(),
    amount: numericAmount,
    category: recurringCategory,
    frequency: recurringFrequency,
    nextDueDate: recurringDueDate,
  };

  setRecurringExpenses((current) => [
    ...current,
    newRecurringExpense,
  ]);

  setRecurringTitle("");
  setRecurringAmount("");
  setRecurringCategory("Bills");
  setRecurringFrequency("Monthly");
  setRecurringDueDate(new Date().toISOString().split("T")[0]);
}

function addIncome(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const numericAmount = Number(incomeAmount);

  if (
    !incomeTitle.trim() ||
    !incomeAmount ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0 ||
    !incomeDate
  ) {
    alert("Please enter a description, a valid amount, and a date.");
    return;
  }

  if (editingIncomeId !== null) {
    // Update the existing income entry
    setIncomes((current) =>
      current.map((income) =>
        income.id === editingIncomeId
          ? {
              ...income,
              title: incomeTitle.trim(),
              amount: numericAmount,
              category: incomeCategory,
              date: incomeDate,
            }
          : income
      )
    );

    setEditingIncomeId(null);
  } else {
    // Add a new income entry
    const newIncome: Income = {
      id: Date.now(),
      title: incomeTitle.trim(),
      amount: numericAmount,
      category: incomeCategory,
      date: incomeDate,
    };

    setIncomes((current) => [newIncome, ...current]);
  }

  // Reset the form
  setIncomeTitle("");
  setIncomeAmount("");
  setIncomeCategory("Salary");
  setIncomeDate(new Date().toISOString().split("T")[0]);
}

function editIncome(income: Income) {
  setEditingIncomeId(income.id);
  setIncomeTitle(income.title);
  setIncomeAmount(String(income.amount));
  setIncomeCategory(income.category);
  setIncomeDate(income.date);
}

function deleteIncome(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this income entry?"
  );

  if (!confirmed) return;

  setIncomes((current) =>
    current.filter((income) => income.id !== id)
  );

  // Cancel editing if the deleted entry was being edited
  if (editingIncomeId === id) {
    setEditingIncomeId(null);
    setIncomeTitle("");
    setIncomeAmount("");
    setIncomeCategory("Salary");
    setIncomeDate(new Date().toISOString().split("T")[0]);
  }
}

function markRecurringExpensePaid(expense: RecurringExpense) {
  const confirmed = window.confirm(
    `Mark "${expense.title}" as paid and add ₹${expense.amount} to your expenses?`
  );

  if (!confirmed) return;

  const paidDate = new Date().toISOString().split("T")[0];
  
const newTransaction: Transaction = {
  id: Date.now(),
  title: expense.title,
  amount: expense.amount,
  category: expense.category,
  date: paidDate,
  paymentMethod: "UPI",
};


  setTransactions((current) => [newTransaction, ...current]);

  setRecurringExpenses((current) =>
    current.map((item) => {
      if (item.id !== expense.id) return item;

      const nextDate = new Date(
        item.nextDueDate + "T12:00:00"
      );

      if (item.frequency === "Weekly") {
        nextDate.setDate(nextDate.getDate() + 7);
      } else {
        const originalDay = nextDate.getDate();
        nextDate.setDate(1);
        nextDate.setMonth(nextDate.getMonth() + 1);

        const lastDay = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth() + 1,
          0
        ).getDate();

        nextDate.setDate(Math.min(originalDay, lastDay));
      }

      return {
        ...item,
        nextDueDate: [
          nextDate.getFullYear(),
          String(nextDate.getMonth() + 1).padStart(2, "0"),
          String(nextDate.getDate()).padStart(2, "0"),
        ].join("-"),
      };
    })
  );
}

function deleteRecurringExpense(id: number) {
  const confirmed = window.confirm(
    "Delete this recurring expense?"
  );

  if (!confirmed) return;

  setRecurringExpenses((current) =>
    current.filter((expense) => expense.id !== id)
  );
}


function exportFullBackup() {
  const backup = {
    appName: "Smart Expense Tracker",
    backupDate: new Date().toISOString(),
    transactions,
    incomes,
    recurringExpenses,
    monthlyBudget,
    savingsGoal,
    amountSaved,
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "smart-expense-backup.json";
  link.click();

  URL.revokeObjectURL(url);
}


function isValidTransactionList(value: unknown): value is Transaction[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.title === "string" &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.category === "string" &&
        typeof item.date === "string" &&
         (item.paymentMethod === undefined ||
        typeof item.paymentMethod === "string")
    )
  );
}

function isValidIncomeList(value: unknown): value is Income[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.title === "string" &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.category === "string" &&
        typeof item.date === "string"
    )
  );
}

function isValidRecurringList(
  value: unknown
): value is RecurringExpense[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.title === "string" &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.category === "string" &&
        (item.frequency === "Weekly" ||
          item.frequency === "Monthly") &&
        typeof item.nextDueDate === "string"
    )
  );
}

function restoreFullBackup(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const backup = JSON.parse(String(reader.result));

      
if (
  backup.appName !== "Smart Expense Tracker" ||
  !isValidTransactionList(backup.transactions) ||
  !isValidIncomeList(backup.incomes) ||
  !isValidRecurringList(backup.recurringExpenses) ||
  typeof backup.monthlyBudget !== "number" ||
  !Number.isFinite(backup.monthlyBudget) ||
  backup.monthlyBudget <= 0 ||
  typeof backup.savingsGoal !== "number" ||
  !Number.isFinite(backup.savingsGoal) ||
  backup.savingsGoal <= 0 ||
  typeof backup.amountSaved !== "number" ||
  !Number.isFinite(backup.amountSaved) ||
  backup.amountSaved < 0
) {
  alert("This backup contains invalid or incomplete data.");
  return;
}


      const confirmed = window.confirm(
        "Restoring this backup will replace your current financial data. Continue?"
      );

      if (!confirmed) return;

      setTransactions(backup.transactions);
      setIncomes(backup.incomes);
      setRecurringExpenses(backup.recurringExpenses);
      setMonthlyBudget(backup.monthlyBudget);
      setSavingsGoal(backup.savingsGoal);
      setAmountSaved(backup.amountSaved);

      alert("Backup restored successfully!");
    } catch {
      alert("Could not read this backup file. Please select a valid backup.");
    } finally {
      event.target.value = "";
    }
  };

  reader.onerror = () => {
    alert("Could not read the selected file.");
    event.target.value = "";
  };

  reader.readAsText(file);
}


function exportTransactions() {
  
const csvContent = [
  ["Description", "Amount", "Category", "Date", "Payment Method"],
  ...filteredTransactions.map((transaction) => [
    transaction.title,
    transaction.amount,
    transaction.category,
    transaction.date,
    transaction.paymentMethod || "Not specified",
  ]),
]

    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "my-expenses.csv";
  link.click();

  URL.revokeObjectURL(url);
}
  

function editTransaction(transaction: Transaction) {
  setEditingId(transaction.id);
  setTitle(transaction.title);
  setAmount(String(transaction.amount));
  setCategory(transaction.category);
  setPaymentMethod(transaction.paymentMethod || "UPI");
  setDate(transaction.date || "");
}


const monthlyIncome = incomes.reduce((total, income) => {
  return income.date && income.date.slice(0, 7) === selectedMonth
    ? total + income.amount
    : total;
}, 0);


const monthlyExpenses = transactions.reduce((total, transaction) => {
  if (!transaction.date) return total;

  const expenseMonth = transaction.date.slice(0, 7);

  if (expenseMonth === selectedMonth) {
    return total + transaction.amount;
  }

  return total;
}, 0); 
const monthlyBalance = monthlyIncome - monthlyExpenses;

  const remainingBudget = monthlyBudget - monthlyExpenses;
  
const savingsProgress =
  savingsGoal > 0
    ? Math.min((amountSaved / savingsGoal) * 100, 100)
    : 0;

const savingsRemaining = Math.max(savingsGoal - amountSaved, 0);

const budgetUsedPercentage =
  monthlyBudget > 0
    ? Math.min((monthlyExpenses / monthlyBudget) * 100, 100)
    : 0;


const categoryTotals = transactions.reduce<Record<string, number>>(
  (totals, transaction) => {
    if (!transaction.date) return totals;

    const expenseMonth = transaction.date.slice(0, 7);

    if (expenseMonth === selectedMonth) {
      totals[transaction.category] =
        (totals[transaction.category] || 0) + transaction.amount;
    }

    return totals;
  },
  {}
);


const chartData = Object.entries(categoryTotals).map(
  ([category, total]) => ({
    name: category,
    amount: total,
  })
);


const monthlySpendingData = Object.entries(
  transactions.reduce<Record<string, number>>((totals, transaction) => {
    if (transaction.date) {
      const month = transaction.date.slice(0, 7);
      totals[month] = (totals[month] || 0) + transaction.amount;
    }
    return totals;
  }, {})
)
  .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
  .map(([month, total]) => ({
    month,
    total,
  }));


const topCategory =
  Object.entries(categoryTotals).length > 0
    ? Object.entries(categoryTotals).reduce((top, current) =>
        current[1] > top[1] ? current : top
      )
    : null;

const monthlyTransactions = transactions.filter(
  (transaction) =>
    transaction.date &&
    transaction.date.slice(0, 7) === selectedMonth
);

const totalMonthlyTransactions = monthlyTransactions.length;

const paymentMethodTotals = monthlyTransactions.reduce<
  Record<string, number>
>((totals, transaction) => {
  const method = transaction.paymentMethod || "Not specified";

  totals[method] = (totals[method] || 0) + transaction.amount;

  return totals;
}, {});
const paymentMethodChartData = Object.entries(paymentMethodTotals).map(
  ([method, total]) => ({
    name: method,
    amount: total,
  })
);

const lowestExpense =
  monthlyTransactions.length > 0
    ? monthlyTransactions.reduce((lowest, transaction) =>
        transaction.amount < lowest.amount ? transaction : lowest
      )
    : null;

const highestExpense =
  monthlyTransactions.length > 0
    ? monthlyTransactions.reduce((highest, transaction) =>
        transaction.amount > highest.amount ? transaction : highest
      )
    : null;


const averageExpense =
  totalMonthlyTransactions > 0
    ? monthlyTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      ) / totalMonthlyTransactions
    : 0;


const filteredTransactions = monthlyTransactions.filter(
  (transaction) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      transaction.title.toLowerCase().includes(search) ||
      transaction.category.toLowerCase().includes(search) ||
      (transaction.paymentMethod || "")
        .toLowerCase()
        .includes(search);

    const method = transaction.paymentMethod || "Not specified";

    const matchesPaymentMethod =
      paymentMethodFilter === "All" ||
      method === paymentMethodFilter;

    const matchesStartDate =
      !startDate || transaction.date >= startDate;

    const matchesEndDate =
      !endDate || transaction.date <= endDate;

    return (
      matchesSearch &&
      matchesPaymentMethod &&
      matchesStartDate &&
      matchesEndDate
    );
  }
);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">₹</div>
        <div>
          <h1>Smart Expense Tracker</h1>
          <p>Take control of your money.</p>
        </div>
      </header>

      <main className="dashboard">
        
<div className="print-report-title">
  <h2>Monthly Expense Report</h2>
  <p>Smart Expense Tracker | Personal Finance Summary</p>
</div>

        <section className="welcome">
          <p className="eyebrow">YOUR FINANCIAL OVERVIEW</p>
          <h2>Welcome to your dashboard!</h2>
          <p>
            Track expenses, manage budgets, and understand where your money
            goes.
          </p>
        </section>

        <section className="summary">
          
<div className="summary-card">
  <p>Monthly Balance</p>
  <h2>₹{monthlyBalance.toLocaleString("en-IN")}</h2>
  <span>Income minus expenses for the selected month</span>
</div>

<div className="summary-card">
  <p>Monthly Income</p>
  <h2>₹{monthlyIncome.toLocaleString("en-IN")}</h2>
  <span>Total income for the selected month</span>
</div>

          
<div className="summary-card">
  <p>Monthly Budget</p>
  <h2>₹{monthlyBudget.toLocaleString("en-IN")}</h2>
  <input
    type="number"
    min="1"
    placeholder="Enter monthly budget"
    value={monthlyBudget}
    onChange={(event) => {
      const value = Number(event.target.value);
      if (value > 0) {
        setMonthlyBudget(value);
      }
    }}
  />
  <span>Your spending limit for the month</span>
  
<div className="budget-progress">
  <div
    className={`budget-progress-fill ${
      budgetUsedPercentage >= 100
        ? "budget-danger"
        : budgetUsedPercentage >= 80
        ? "budget-warning-fill"
        : "budget-safe-fill"
    }`}
    style={{
      width: `${Math.min(budgetUsedPercentage, 100)}%`,
    }}
  />
</div>

<p>{budgetUsedPercentage.toFixed(0)}% of budget used</p>

{budgetUsedPercentage >= 100 ? (
  <p className="budget-alert">
    ⚠️ Budget exceeded! Try to reduce your spending.
  </p>
) : budgetUsedPercentage >= 80 ? (
  <p className="budget-warning">
    ⚠️ You're close to your budget limit!
  </p>
) : (
  <p className="budget-safe">
    ✅ You're within your budget. Keep it up!
  </p>
)}

<span>
  {remainingBudget >= 0
    ? `₹${remainingBudget.toLocaleString("en-IN")} remaining`
    : `₹${Math.abs(remainingBudget).toLocaleString("en-IN")} over budget`}
</span>
</div>

<div className="summary-card">
  <p>Monthly Expenses</p>

  <label>
    Select month
    <input
      type="month"
      value={selectedMonth}
      onChange={(event) => setSelectedMonth(event.target.value)}
    />
  </label>

  <h2>₹{monthlyExpenses.toLocaleString("en-IN")}</h2>
  <span>Expenses for the selected month</span>
</div>

<div className="summary-card">
  <p>Total Transactions</p>
  <h2>{totalMonthlyTransactions}</h2>
  <span>Expenses recorded for the selected month</span>
</div>

<div className="summary-card">
  <p>Average Expense</p>
  <h2>₹{averageExpense.toFixed(2)}</h2>
  <span>Average per transaction this month</span>
</div>

<div className="summary-card">
  <p>Highest Expense</p>
  <h2>
    {highestExpense ? `₹${highestExpense.amount.toFixed(2)}` : "₹0.00"}
  </h2>
  <span>
    {highestExpense
      ? highestExpense.title
      : "No expenses this month"}
  </span>
</div>

<div className="summary-card">
  <p>Lowest Expense</p>
  <h2>
    {lowestExpense ? `₹${lowestExpense.amount.toFixed(2)}` : "₹0.00"}
  </h2>
  <span>
    {lowestExpense
      ? lowestExpense.title
      : "No expenses this month"}
  </span>
</div>


<div className="summary-card">
  <p>Top Spending Category</p>
  <h2>{topCategory ? topCategory[0] : "No expenses"}</h2>
  <span>
    {topCategory
      ? `₹${topCategory[1].toFixed(2)} spent this month`
      : "Add an expense to see insights"}
  </span>
</div>
        
        </section>
        
<section className="insights-section">
  <h2>💳 Spending by Payment Method</h2>
  {paymentMethodChartData.length > 0 && (
  
<div style={{ width: "100%", height: 280 }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={paymentMethodChartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip
        formatter={(value) => [
          `₹${Number(value).toLocaleString("en-IN")}`,
          "Spent",
        ]}
      />
      <Bar
        dataKey="amount"
        fill="#6366f1"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
)}

  {Object.keys(paymentMethodTotals).length === 0 ? (
    <p>No expenses recorded for this month yet.</p>
  ) : (
    <ul>
      {Object.entries(paymentMethodTotals).map(([method, total]) => (
        <li key={method}>
          <span>{method}</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </li>
      ))}
    </ul>
  )}
</section>

        <section className="insights-section">
          <h2>💡 Spending Insights</h2>

          <div className="insights-grid">
            <div className="insight-card">
              <h3>Top Spending Category</h3>
              <p>
                {topCategory
                  ? `${topCategory[0]} is your highest spending category this month.`
                  : "Add expenses to discover your top category."}
              </p>
            </div>

            <div className="insight-card">
              <h3>Monthly Budget Status</h3>
              <p>
                {monthlyBudget > 0
                  ? `You have ₹${Math.max(
                      0,
                      monthlyBudget - monthlyExpenses
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} remaining from your monthly budget.`
                  : "Set a monthly budget to track your spending."}
              </p>
            </div>

            <div className="insight-card">
              <h3>Biggest Expense</h3>
              <p>
                {filteredTransactions.length > 0
                  ? `${filteredTransactions.reduce((highest, transaction) =>
                      transaction.amount > highest.amount
                        ? transaction
                        : highest
                    ).title} — ₹${Math.max(
                      ...filteredTransactions.map(
                        (transaction) => transaction.amount
                      )
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "No transactions recorded for this month."}
              </p>
            </div>
          
          </div>

          <div className="spending-tip">
            <h3>💡 Your Monthly Spending Tip</h3>
            <p>
              {monthlyBudget <= 0
                ? "Set a monthly budget to get personalized spending tips."
                : monthlyExpenses > monthlyBudget
                ? "You've exceeded your monthly budget. Review your expenses."
                : monthlyExpenses / monthlyBudget >= 0.8
                ? "Caution: you're getting close to your monthly budget."
                : monthlyExpenses / monthlyBudget >= 0.5
                ? "Keep an eye on your spending for the rest of the month."
                : "You're managing your budget well. Keep it up!"}
            </p>
          </div>
        
</section>

<section className="savings-section">
  <h2>🎯 Monthly Savings Goal</h2>
  <p>Set a target and track how much you have saved.</p>

  <div className="savings-card">
    <label>
      Savings Target (₹)
      <input
        type="number"
        min="1"
        value={savingsGoal}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value > 0) setSavingsGoal(value);
        }}
      />
    </label>

    <label>
      Amount Saved (₹)
      <input
        type="number"
        min="0"
        value={amountSaved}
        onChange={(event) => {
          const value = event.target.value;
          if (value !== "" && Number(value) >= 0) {
            setAmountSaved(Number(value));
          } else if (value === "") {
            setAmountSaved(0);
          }
        }}
      />
    </label>

    <h3>
      ₹{amountSaved.toLocaleString("en-IN")} saved out of ₹
      {savingsGoal.toLocaleString("en-IN")}
    </h3>

    <div
      className="budget-progress"
      style={{
        height: "14px",
        background: "#e2e8f0",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        className="budget-progress-fill"
        style={{
          width: `${savingsProgress}%`,
          height: "100%",
          background: "#14b8a6",
          borderRadius: "999px",
          transition: "width 0.3s ease",
        }}
      />
    </div>

    <p>{savingsProgress.toFixed(0)}% of your savings goal reached</p>

    {amountSaved >= savingsGoal ? (
      <p>🎉 Congratulations! You reached your savings goal!</p>
    ) : (
      <p>
        ₹{savingsRemaining.toLocaleString("en-IN")} left to reach your goal.
      </p>
    )}
  </div>
</section>


<section className="recurring-section">
  <h2>🔁 Recurring Expenses</h2>
  <p>Manage your regular bills and upcoming payments.</p>

  <div className="recurring-card">
    <h3>Add a Recurring Expense</h3>

    <form onSubmit={addRecurringExpense} className="expense-form">
      <label>
        Description
        <input
          type="text"
          placeholder="e.g. House Rent"
          value={recurringTitle}
          onChange={(event) => setRecurringTitle(event.target.value)}
          required
        />
      </label>

      <label>
        Amount (₹)
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="e.g. 8000"
          value={recurringAmount}
          onChange={(event) => setRecurringAmount(event.target.value)}
          required
        />
      </label>

      <label>
        Category
        <select
          value={recurringCategory}
          onChange={(event) => setRecurringCategory(event.target.value)}
        >
          <option>Bills</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Health</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Repeat
        <select
          value={recurringFrequency}
          onChange={(event) =>
            setRecurringFrequency(
              event.target.value as "Weekly" | "Monthly"
            )
          }
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </label>

      <label>
        Next Due Date
        <input
          type="date"
          value={recurringDueDate}
          onChange={(event) => setRecurringDueDate(event.target.value)}
          required
        />
      </label>

      <button type="submit">Add Recurring Expense</button>
    </form>
  </div>

  <div className="recurring-list">
    <h3>Your Scheduled Payments</h3>

    <p>
      Total scheduled per cycle: ₹
      {recurringExpenses
        .reduce((total, expense) => total + expense.amount, 0)
        .toLocaleString("en-IN")}
    </p>

    {recurringExpenses.length === 0 ? (
      <p>No recurring expenses yet. Add your first regular bill above!</p>
    ) : (
      <ul className="transaction-list">
        {[...recurringExpenses]
          .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))
          .map((expense) => (
            <li key={expense.id} className="transaction-item">
              <div>
                <strong>{expense.title}</strong>
                <p>{expense.category} · {expense.frequency}</p>
                <p>
                  Next due:{" "}
                  {new Date(
                    expense.nextDueDate + "T00:00:00"
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="transaction-actions">
                <strong>
                  ₹{expense.amount.toLocaleString("en-IN")}
                </strong>

                <button
                  type="button"
                  onClick={() => markRecurringExpensePaid(expense)}
                >
                  Mark as Paid
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteRecurringExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    )}
  </div>
</section>


<section className="income-section">
  <h2>💰 Income Tracking</h2>
  <p>Record your salary, freelance earnings, and other income.</p>

  <div className="income-card">
    <h3>Add Income</h3>

    <form onSubmit={addIncome} className="expense-form">
      <label>
        Description
        <input
          type="text"
          placeholder="e.g. Monthly Salary"
          value={incomeTitle}
          onChange={(event) => setIncomeTitle(event.target.value)}
          required
        />
      </label>

      <label>
        Amount (₹)
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="e.g. 30000"
          value={incomeAmount}
          onChange={(event) => setIncomeAmount(event.target.value)}
          required
        />
      </label>

      <label>
        Category
        <select
          value={incomeCategory}
          onChange={(event) => setIncomeCategory(event.target.value)}
        >
          <option>Salary</option>
          <option>Freelance</option>
          <option>Business</option>
          <option>Investment</option>
          <option>Gift</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Date
        <input
          type="date"
          value={incomeDate}
          onChange={(event) => setIncomeDate(event.target.value)}
          required
        />
      </label>

<button type="submit">
  {editingIncomeId !== null ? "Save Changes" : "Add Income"}
</button>

{editingIncomeId !== null && (
  <button
    type="button"
    onClick={() => {
      setEditingIncomeId(null);
      setIncomeTitle("");
      setIncomeAmount("");
      setIncomeCategory("Salary");
      setIncomeDate(new Date().toISOString().split("T")[0]);
    }}
  >
    Cancel
  </button>
)}
    </form>
  </div>

  <div className="income-card">
<h3>Income History — {selectedMonth}</h3>

{incomes.filter(
  (income) => income.date?.slice(0, 7) === selectedMonth
).length === 0 ? (
  <p>No income recorded for this month yet.</p>
) : (
  <ul className="transaction-list">
    {incomes
      .filter(
        (income) => income.date?.slice(0, 7) === selectedMonth
      )
      .map((income) => (
        <li key={income.id} className="transaction-item">
          <div>
            <strong>{income.title}</strong>
            <p>{income.category}</p>
            <p>
              {new Date(income.date + "T00:00:00").toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>

          <div className="transaction-actions">
            <strong>
              +₹{income.amount.toLocaleString("en-IN")}
            </strong>

            <button
              type="button"
              onClick={() => editIncome(income)}
            >
              Edit
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={() => deleteIncome(income.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
  </ul>
)}
  </div>
</section>


<section className="transactions">


  <div className="expense-entry">
    <h2>Add an Expense</h2>

    <form onSubmit={addTransaction} className="expense-form">

            <label>
              Description
              <input
                type="text"
                placeholder="e.g. Lunch"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>

            <label>
              Amount (₹)
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 250"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>

            <label>
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Health</option>
                <option>Other</option>
              </select>
            </label>
            <label>
  Payment Method
  <select
    value={paymentMethod}
    onChange={(event) => setPaymentMethod(event.target.value)}
  >
    <option value="UPI">UPI</option>
    <option value="Cash">Cash</option>
    <option value="Credit Card">Credit Card</option>
    <option value="Debit Card">Debit Card</option>
    <option value="Net Banking">Net Banking</option>
  </select>
</label>

           <button type="submit">
  {editingId !== null ? "Save Changes" : "Add Expense"}
</button>

{editingId !== null && (
  <button
    type="button"
    onClick={() => {
      setEditingId(null);
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().split("T")[0]);
    }}
  >
    Cancel
  </button>
)}
          </form>
          </div>
          
<section className="category-breakdown">
  <h2>Spending by Category</h2>

  {chartData.length > 0 && (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
   
<Pie
  data={chartData}
  dataKey="amount"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={95}
>
  {chartData.map((entry, index) => (
    <Cell
      key={entry.name}
      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
    />
  ))}
</Pie>


          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Spent",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</section>

<section className="chart-section">
  <h2>Monthly Spending Trend</h2>
  <p>Compare your expenses across months</p>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={monthlySpendingData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
      <Line
  type="monotone"
  dataKey="total"
  name="Monthly Expenses"
  stroke="#6366f1"
  strokeWidth={3}
  dot={{ r: 5 }}
  activeDot={{ r: 8 }}
  label={{
  position: "top",
  formatter: (value) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
}}
/>
    </LineChart>
  </ResponsiveContainer>
</section>



  {Object.keys(categoryTotals).length === 0 ? (
    <p>Your category totals will appear here when you add expenses.</p>
  ) : (
    <ul>
      {Object.entries(categoryTotals).map(([category, total]) => (
        <li key={category}>
          <span>{category}</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </li>
      ))}
    </ul>
  )}
          
<h2 className="recent-title">Recent Transactions</h2>

<button type="button" onClick={exportTransactions}>
  Export Expenses (CSV)
</button>

<button type="button" onClick={exportFullBackup}>
  Download Full Backup
</button>

<label className="restore-backup-button">
  Restore Full Backup
  <input
    type="file"
    accept=".json,application/json"
    onChange={restoreFullBackup}
    style={{ display: "none" }}
  />
</label>



<button onClick={() => window.print()}>
  Print / Save as PDF
</button>


<div>
  <input
    type="text"
    placeholder="Search by description, category, or payment method..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />

  {searchTerm && (
    <button
      type="button"
      onClick={() => setSearchTerm("")}
    >
      Clear Search
    </button>
  )}
</div>
<div>
  <label htmlFor="paymentMethodFilter">Filter by payment method: </label>
  <select
    id="paymentMethodFilter"
    value={paymentMethodFilter}
    onChange={(event) => setPaymentMethodFilter(event.target.value)}
  >
    <option value="All">All payment methods</option>
    <option value="UPI">UPI</option>
    <option value="Cash">Cash</option>
    <option value="Card">Card</option>
    <option value="Net Banking">Net Banking</option>
    <option value="Not specified">Not specified</option>
  </select>
</div>

<div className="date-range-filter">
  <label>
    Start date
    <input
      type="date"
      value={startDate}
      onChange={(event) => setStartDate(event.target.value)}
    />
  </label>

  <label>
    End date
    
<input
  type="date"
  value={endDate}
  min={startDate || undefined}
  onChange={(event) => setEndDate(event.target.value)}
/>
{startDate && endDate && endDate < startDate && (
  <p className="budget-alert">
    ⚠️ End date must be on or after the start date.
  </p>
)}

  </label>

  <button
    type="button"
    onClick={() => {
      setStartDate("");
      setEndDate("");
    }}
  >
    Clear dates
  </button>
</div>

          {filteredTransactions.length === 0 ? (
  <p>
    {searchTerm.trim()
      ? "No expenses match your search."
      : "No expenses found for the selected month."}
  </p>
          ) : (
            <ul className="transaction-list">
              {filteredTransactions.map((transaction) => (
                <li key={transaction.id} className="transaction-item">
                  
<div>
  <strong>{transaction.title}</strong>
  <p>{transaction.category} · {transaction.paymentMethod || "Not specified"}</p>
  <p>
    📅 {transaction.date
      ? new Date(transaction.date + "T00:00:00").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Date not available"}
  </p>
</div>


<div className="transaction-actions">
  <strong>
    −₹{transaction.amount.toLocaleString("en-IN")}
  </strong>

  <button
    type="button"
    onClick={() => editTransaction(transaction)}
  >
    Edit
  </button>

  <button
    type="button"
    className="delete-button"
    onClick={() => deleteTransaction(transaction.id)}
    aria-label={`Delete ${transaction.title}`}
  >
    Delete
  </button>
</div>

                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
