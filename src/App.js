import { useEffect, useState } from "react";
import supabase from "./supabase.js";
import "./style.css";
import { async } from "q";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setcount] = useState(8);
  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      {/* 如果直接用setcount(值) 只會回傳所設的數值*/}
      <button
        className="btn btn-large"
        onClick={() => setcount((c) => (c += 1))}
      >
        +1
      </button>
    </div>
  );
}

// 裡面不是html是Jsx，自動轉換為JS可以理解的語言，所以class要用className
// JSX元素需字首大寫
//如果要返回多個元素，要用<></>包起來。避免使用div造成不必要的DOM汙染

function App() {
  // [值,函式]=useState();
  const [showForm, setshowFrom] = useState(false);
  const [facts, setFacts] = useState([]);

  //串接supabase API資料
  useEffect(function () {
    async function getFacts() {
      const { data: facts, error } = await supabase.from("facts").select("*");
      setFacts(facts);
    }
    getFacts();
  }, []);

  return (
    <>
      <Header setshowFrom={setshowFrom} showForm={showForm} />

      {/* FROM顯示與否 */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setshowFrom={setshowFrom} />
      ) : null}

      <main className="main">
        <CategoryFilter />
        <FactList facts={facts} />
      </main>
    </>
  );
}

function Header({ showForm, setshowFrom }) {
  const appTitle = "today i learning";
  return (
    // HEADER
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Logo" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setshowFrom((show) => !show)}
      >
        {/* 變更文字 */}
        {showForm ? "close" : "share a fact"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

//驗證URL
function isValidURLUsingURLAPI(url) {
  try {
    // 嘗試建立一個 URL 物件
    new URL(url);
    return true;
  } catch (e) {
    // 如果構造函數拋出錯誤，則表示 URL 無效
    return false;
  }
}

function NewFactForm({ setFacts, setshowFrom }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function handleSubmit(e) {
    // 1. 阻止瀏覽器重新載入
    e.preventDefault();
    console.log(text, source, category);

    // 2. 檢查資料是否有效。如果有效，則建立一個新的事實
    if (
      text &&
      isValidURLUsingURLAPI(source) &&
      category &&
      textLength <= 200
    ) {
      // 3. 建立一個新的事實物件
      const newFact = {
        id: Math.round(Math.random() * 10000000),
        text,
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };

      // 4. 將新的事實新增到使用者介面：將事實新增到state
      setFacts((facts) => [newFact, ...facts]);
      // 5. 重設輸入欄位
      setText("");
      setSource("");
      setCategory("");

      // 6. 關閉表單
      setshowFrom(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>

      <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categorise">All</button>
        </li>
        {CATEGORIES.map((category) => (
          <li key={category.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {facts.length} Facts in database. Add your own!</p>
    </section>
  );
}

// props
function Fact({ fact }) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (category) => category.name === fact.category
          ).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍{fact.votesInteresting}</button>
        <button>🤯{fact.votesMindblowing}</button>
        <button>⛔️{fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
