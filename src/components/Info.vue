<template>
  <div class="info-container">
    <div class="train-instructions">
      <h3>🚂 火车交互控制</h3>
      <ul>
        <li><span class="key">Hover</span> 鼠标悬停 → 高亮显示</li>
        <li><span class="key">Click</span> 点击火车 → 加速/恢复</li>
      </ul>
    </div>
    <a href="https://github.com/yorickshan/Three.js-Vue3-Boilerplate" target="_blank" rel="noopener noreferrer" class="repo-link">
      <span>A modern starter project for Three.js | GitHub</span>
      <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="outbound-link-title" role="img" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound">
        <title id="outbound-link-title">(opens new window)</title>
        <path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
        <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
      </svg>
    </a>
  </div>
</template>

<style scoped>
.info-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.train-instructions {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.train-instructions h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.train-instructions ul {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.train-instructions li {
  font-size: 13px;
  margin-bottom: 8px;
  color: #d1d5db;
}

.train-instructions li:last-child {
  margin-bottom: 0;
}

.key {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 6px;
  color: #fbbf24;
}

.repo-link {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.repo-link:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon.outbound {
  opacity: 0.6;
}
</style>
