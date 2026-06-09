import React from "react";
import { JSDocNullableType } from "typescript";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118840",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933341",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499442",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = React.useState(false);
  const [friends, setFriends] = React.useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = React.useState<any | null>(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend: any) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend: any) {
    setSelectedFriend((cur: any) => ( cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value: number) {
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriend?.id ? { ...friend, balance: friend.balance + value } : friend));
    setSelectedFriend(null);  
  }


  return (
    <div className="app">
      <div className="sidebar">
        <h1>Splitwise</h1>
        <FriendList friends={friends} onSelectedFriend={handleSelectFriend}  selectedFriend={selectedFriend} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "+ Add Friend"}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
  );
}

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendList({ friends, onSelectedFriend,selectedFriend }: { friends: any[]; 
  onSelectedFriend: (friend: any) => void; 
  selectedFriend: any;
 } ) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} onSelectedFriend={onSelectedFriend} selectedFriend={selectedFriend} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectedFriend, selectedFriend }: {
   friend: any; onSelectedFriend: (friend: any) => void; selectedFriend: any }) {

  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe &nbsp;
          {friend.name} ${Math.abs(friend.balance)}'$'
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} &nbsp; owes you &nbsp; ${Math.abs(friend.balance)}'$'
        </p>
      )}

      {friend.balance === 0 && (
        <p>
          You and &nbsp;
          {friend.name} Are even
        </p>
      )}

      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }: { onAddFriend: (friend: any) => void }) {

  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('https://i.pravatar.cc/48');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
    id: crypto.randomUUID(),
    name,
    image: `${image}?u=${crypto.randomUUID()}`,
    balance: 0,
  };
  
  console.log(newFriend);

  onAddFriend(newFriend);

  setName('');
  setImage('https://i.pravatar.cc/48');
  }

  

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label> 📷 Friend Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }: { friend: any ; onSplitBill: (value: number) => void }) {

  const [billValue, setBillValue] = React.useState<number>(0.00);
  const [userExpense, setUserExpense] = React.useState<number>(0.00);
  const [whoIsPaying, setWhoIsPaying] = React.useState('user');

  const friendExpense = billValue ? billValue - userExpense : 0;

  function handleSplitBillSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!billValue || !userExpense) return;

    const amount = whoIsPaying === 'user' ? friendExpense : -userExpense;

    onSplitBill(amount);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitBillSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>💰 Bill Value</label>
      <input type="text" value={billValue} onChange={(e) => setBillValue(Number(e.target.value))} />

      <label>🧍 Your Expense</label>
      <input type="text" value={userExpense} onChange={(e) => setUserExpense
        (Number(e.target.value) > billValue ? billValue : Number(e.target.value))} />

      <label>🧑 {friend.name}'s Expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>👭 Who is paying the bill?</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
