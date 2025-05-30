<template>
  <div class="single-page">
    <div class="not-found">
      <div class="not-found-content">
        <h1>404</h1>
        <p>抱歉，页面不见了 (；′⌒`)</p>
        <router-link to="/" class="back-home">
          <i class="fas fa-home"></i>
          返回首页
        </router-link>
      </div>
    </div>
  </div>
  </template>
  
<script setup>




 </script>


  <style >
  .not-found {
    min-height: calc(100vh - 140px);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 32px;
    background: var(--background);
  }
  
  .not-found-content {
    max-width: 600px;
    width: 100%;
    animation: fadeInUp 0.6s ease-out;
  }
  
  .not-found-content h1 {
    font-size: 120px;
    color: var(--color-primary);
    margin-bottom: 24px;
    font-weight: 700;
    line-height: 1;
    text-shadow: 4px 4px 0px rgba(var(--color-primary), 0.2);
  }
  
  .not-found-content p {
    font-size: 1.5em;
    color: var(--text-secondary);
    margin-bottom: 32px;
  }
  
  .back-home {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    background: var(--color-primary);
    color: white;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .back-home:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--color-primary), 0.3);
  }
  
  .back-home i {
    font-size: 1.1em;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 响应式：小屏幕适配 */
  @media (max-width: 640px) {
    .not-found-content h1 {
      font-size: 80px;
    }
  
    .not-found-content p {
      font-size: 1.2em;
    }
  }
  </style>