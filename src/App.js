import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState(['']);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [activeTab, setActiveTab] = useState('tracker');
  const [currency, setCurrency] = useState('₹');
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);

  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [amountToConvert, setAmountToConvert] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/cb3dd096c4a63de2c5625893/latest/${baseCurrency}`);
        const data = await res.json();
        setExchangeRates(data.conversion_rates);
      } catch (err) {
        console.error("Failed to fetch exchange rates", err);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  const convertedAmount = exchangeRates[fromCurrency] && exchangeRates[toCurrency]
    ? ((amountToConvert / exchangeRates[fromCurrency]) * exchangeRates[toCurrency]).toFixed(2)
    : '...';

  const addExpense = () => {
    if (!amount || !desc) return;
    const amt = parseFloat(amount);
    setExpenses([...expenses, { amount: amt, desc }]);
    const newXP = xp + amt;
    setXP(newXP);
    const nextLevelXP = level * 500;
    if (newXP >= nextLevelXP) {
      setLevel(level + 1);
      setXP(newXP - nextLevelXP);
    }
    setAmount('');
    setDesc('');
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = members.length > 0 ? (totalExpense / members.length).toFixed(2) : 0;

  const addMember = () => setMembers([...members, '']);
  const updateMember = (index, name) => {
    const updated = [...members];
    updated[index] = name;
    setMembers(updated);
  };
  const removeMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  return (
    <div className="App">
      <h1>💸 Expense Tracker & Splitter</h1>

      {/* 🎯 Currency Selector */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Select Currency:</label>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            padding: '5px',
            fontFamily: 'monospace',
            borderRadius: '5px',
            background: '#000',
            color: '#00ffcc',
            border: '1px solid #00ffcc'
          }}
        >
          <option value="₹">₹ INR</option>
          <option value="$">$ USD</option>
          <option value="€">€ EUR</option>
          <option value="£">£ GBP</option>
          <option value="¥">¥ JPY</option>
        </select>
      </div>

      {/* 🌐 Live Exchange Rate Selector */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Base Currency:</label>
        <select 
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          style={{
            padding: '5px',
            fontFamily: 'monospace',
            borderRadius: '5px',
            background: '#111',
            color: '#fff',
            border: '1px solid #555'
          }}
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>

        <div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
          <p>📈 Live Rates:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>1 {baseCurrency} = ₹ {exchangeRates['INR']}</li>
            <li>1 {baseCurrency} = $ {exchangeRates['USD']}</li>
            <li>1 {baseCurrency} = € {exchangeRates['EUR']}</li>
            <li>1 {baseCurrency} = £ {exchangeRates['GBP']}</li>
            <li>1 {baseCurrency} = ¥ {exchangeRates['JPY']}</li>
          </ul>
        </div>
      </div>

      {/* 💱 Currency Converter */}
      <div style={{
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '1rem',
        border: '2px dashed #00ffcc',
        borderRadius: '10px',
        textAlign: 'center',
        fontFamily: 'monospace'
      }}>
        <h3>💱 Currency Converter</h3>
        <input
          type="number"
          value={amountToConvert}
          onChange={(e) => setAmountToConvert(e.target.value)}
          placeholder="Enter amount"
          style={{
            padding: '8px',
            width: '100%',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <span>→</span>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
        <p>
          {amountToConvert} {fromCurrency} = <strong>{convertedAmount}</strong> {toCurrency}
        </p>
      </div>

      {/* 🎮 XP and Level */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p>🎮 Level: <strong>{level}</strong></p>
        <p>⚡ XP: {xp} / {level * 500}</p>
        <div style={{ height: '10px', width: '60%', margin: 'auto', background: '#333', borderRadius: '5px' }}>
          <div style={{
            height: '100%',
            width: `${(xp / (level * 500)) * 100}%`,
            background: '#00ffcc',
            borderRadius: '5px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('tracker')} className={activeTab === 'tracker' ? 'active' : ''}>Tracker</button>
        <button onClick={() => setActiveTab('splitter')} className={activeTab === 'splitter' ? 'active' : ''}>Splitter</button>
      </div>

      {/* Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="card">
          <input
            type="number"
            placeholder={`Amount (${currency})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={addExpense}>Add Expense</button>
          <h2>Expenses</h2>
          <ul>
            {expenses.map((e, i) => (
              <li key={i}>{currency}{e.amount} - {e.desc}</li>
            ))}
          </ul>
          <p>Total: {currency}{totalExpense.toFixed(2)}</p>
        </div>
      )}

      {/* Splitter Tab */}
      {activeTab === 'splitter' && (
        <div className="card">
          <h2>Split Between Members</h2>
          {members.map((m, i) => (
            <div key={i} className="member-input">
              <input
                placeholder={`Member ${i + 1}`}
                value={m}
                onChange={(e) => updateMember(i, e.target.value)}
              />
              <button onClick={() => removeMember(i)}>Remove</button>
            </div>
          ))}
          <button onClick={addMember}>Add Member</button>
          <p>Each person owes: <span className="font-bold">{currency}{perPerson}</span></p>
        </div>
      )}
    </div>
  );
}

export default App;
