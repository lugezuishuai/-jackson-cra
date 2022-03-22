import React from 'react';
import './index.less';

const rapList = ['我出门总是带着五瓶药水', '手中的卡牌不停切换到位'];

export function App() {
  return (
    <ul className="container">
      @jacksonhuang/cra-cli 模板
      {rapList.map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  );
}
