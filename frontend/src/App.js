import './App.css';
// import Chat from './Chat.js';
import Info from './Info.js';


function App() {
   
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-zinc-500">
      <div className = ' flex flex-col w-full items-center justify-center h-1/6 mx-20'>
        <div className = 'text-5xl font-bold'>Materials Insight</div>
        <div className = 'text-3xl font-bold'>By Abdulai Bah</div>
      </div>
      <div className = 'flex flex-row space-x-10 mx-5 h-3/4'>
        <Info/>
        <Info/>
        <Info/>
      </div>
    </div>
  );
}

export default App;
