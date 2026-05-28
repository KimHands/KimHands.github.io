// 인라인으로 <head>에서 실행 — 페인트 전에 테마 결정
export const themeInit = `
(function(){
  try{
    var s = localStorage.getItem('theme');
    var d = s ? s === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    if(d) document.documentElement.setAttribute('data-theme','dark');
  }catch(e){}
})();
`;
