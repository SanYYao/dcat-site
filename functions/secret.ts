// CF Pages Function: /secret —— Rick Roll 智能地理路由
// 国内（CN）→ B 站（带 43 秒标记点），其他 → YouTube（43 秒名场面）
export const onRequest: PagesFunction = async ({ request }) => {
  // 从 Cloudflare 请求标头获取访问者国家/地区代码
  // 本地开发没有 cf 对象时 fallback 到空字符串（默认走国外）
  const country =
    request.headers.get('cf-ipcountry') ||
    (request as unknown as { cf?: { country?: string } }).cf?.country ||
    '';

  const isChina = country === 'CN';

  const destination = isChina
    ? 'https://www.bilibili.com/video/BV1GJ411x7h7/?t=43'
    : 'https://youtu.be/dQw4w9WgXcQ?t=43&is=raw35M6ec4dVRf6k';

  return Response.redirect(destination, 302);
};
