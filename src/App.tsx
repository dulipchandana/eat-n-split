import React from "react";
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

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h1>Splitwise</h1>
        <FriendList />
        {showAddFriend && <FormAddFriend />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "+ Add Friend"}
        </Button>
      </div>
      <FormSplitBill />
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

function FriendList() {
  const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}

function Friend({ friend }: { friend: any }) {
  return (
    <li>
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

      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend() {
  return (
    <form className="form-add-friend">
      <label>👭 Friend Name</label>
      <input type="text" />

      <label> 📷 Friend Image URL</label>
      <input type="text" />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with Clark</h2>
      <label>💰 Bill Value</label>
      <input type="text" />

      <label>🧍 Your Expense</label>
      <input type="text" />

      <label>🧑 Clark's Expense</label>
      <input type="text" disabled />

      <label>👭 Who is paying the bill?</label>
      <select>
        <option value="user">You</option>
        <option value="friend">Clark</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
