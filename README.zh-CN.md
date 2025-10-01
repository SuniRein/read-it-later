# 稍后读·简

[English](./README.md) | [简体中文](./README.zh-CN.md)

一款轻量级浏览器稍后阅读扩展——与其他同类产品不同，本扩展仅保存网页链接等基础信息，**不会存储网页内容**。

> 灵感来源：[in-my-pocket](https://github.com/pabuisson/in-my-pocket)

## 开发背景

我长期使用 [Pocket](https://getpocket.com) 管理稍后阅读列表，但其将于 **2025年7月7日** 后[停止维护](https://support.mozilla.org/en-US/kb/future-of-pocket)。
虽然存在类似替代品，但这些产品普遍存在一个关键缺陷：**缺乏优质的浏览器扩展支持**，而浏览器正是我阅读网页内容的主要场景。
鉴于我的核心需求（仅需保存链接，无需离线内容），决定自主开发一款轻量解决方案。

## 项目特点

- **极简轻量**：不保存网页内容，仅存储基础元数据
- **一键收藏**：快速添加当前网页至阅读列表
- **高效管理**：直观的用户界面，轻松管理阅读清单

## 插件安装

- [Firefox Addons](https://addons.mozilla.org/firefox/addon/read-it-later-simply)

## 开发指南

该扩展基于 [WXT 框架](https://wxt.dev/)构建。

1. 克隆本仓库。

1. 安装依赖。

    ```bash
    pnpm install
    ```

1. 在浏览器中加载扩展。

    ```bash
    pnpm run dev # Chrome
    pnpm run dev:firefox # Firefox
    ```

## 许可协议

项目采用 [GPL-3.0 协议](https://www.gnu.org/licenses/gpl-3.0.en.html)开源，详见 [LICENSE](./LICENSE)。
