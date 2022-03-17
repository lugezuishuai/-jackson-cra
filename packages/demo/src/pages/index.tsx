import React from 'react';
import ReactDOM from 'react-dom';
import './indexless';

const rapList = ['我出门总是带着五瓶药水', '手中的卡牌不停切换到位'];

const App = () => {
  return (
    <ul className="container">
      @jacksonhuang/cra-cli 模板
      {rapList.map(v => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
