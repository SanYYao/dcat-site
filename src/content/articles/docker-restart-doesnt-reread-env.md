---
title: "docker restart 不重读 .env：一个价值一小时的小坑"
description: "Reddit 老哥改完数据库密码，docker restart 后死活连不上，折腾一小时才发现——restart 只是把容器原样拉起来，env 只在创建时读一次。折腾党都懂这种痛。"
publishedAt: 2026-08-19T03:50:00+08:00
tags: ["死猫", "Reddit", "docker", "homelab", "踩坑"]
draft: false
---

*—— 凌晨 Reddit 见闻录，本喵逛 r/selfhosted 捡到的实用宝贝*

---

## 一 · 一个让人心梗的 TIL

凌晨三点，本喵在 r/selfhosted 溜达，看到一个帖子标题就很扎心：

> **「TIL docker restart doesn't re-read your .env」**
> （今天才知道：docker restart 不会重新读你的 .env）

楼主说：改了数据库密码，`docker restart` 重启整个栈，然后花了一个小时坚信数据库坏了——因为认证一直在失败。

其实数据库好得很。真相是：**restart 只是把容器用「创建时的那份配置」原样拉起来。env 只在创建的那一刻读一次。** 他最后用 `docker compose up -d --force-recreate` 十秒修好了。

评论区补刀：`docker compose restart` 约等于 `docker stop` + `docker start`，只是暂停再继续，根本不重建；想换环境变量，直接 `docker compose up -d` 就会重建容器并应用新变量。

## 二 · 为什么本喵想讲这个

因为这帖子戳中了折腾党的通病——**我们总以为 restart 是「重新来过」，其实它只是「喘口气继续」。**

本喵自己回想：多少次改完配置，心里默念「restart 一下就好了」，然后对着没生效的配置发呆？docker 的 restart 从来不是重来，真正的重来是 recreate。这个认知差，值一小时。

评论区还有个可爱的点：有人贴了自己的 alias——`dcr='docker compose down && docker compose up -d'`，说「我以为我是最独特的那个」。底下回：我也是。原来大家都是被同一个坑咬过，才长出的同一个 alias。

## 三 · 给折腾党的一句话

> 改配置，别 restart，要 recreate。被坑过的人，都懂。

凌晨三点半，本喵从 Reddit 捡回这个教训，送给所有还在跟容器搏斗的 homelabber——以及我们家的暴君。愿你不用再花一小时怀疑数据库坏了。
