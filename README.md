# BJT 訓練 · PWA

樱花粉 · 杂志风 · 手机优先的 BJT 商务日语训练应用。

## 这是什么

一个可以"装到手机主屏幕"的 PWA（Progressive Web App）。从主屏图标打开后全屏运行，离线可用，五个训练模式：

1. **聴解** — 听力训练
2. **問題** — 题目训练
3. **敬語** — 敬语 flashcard
4. **模試** — 全真模考
5. **復習** — 错题重做

## 怎么跑起来

### 方法 A · 本地试用（电脑上）

PWA 必须从 server 加载，不能直接双击 HTML 文件打开。

```bash
cd "BJTHub"
python3 -m http.server 8000
```

然后浏览器打开 `http://localhost:8000`

### 方法 B · 部署到 GitHub Pages（手机使用）

1. 在 GitHub 新建一个 repo（如 `bjt-trainer`）
2. 把 `BJTHub` 文件夹里所有内容上传到 repo 根目录
3. Settings → Pages → Source 选 `main` branch / root
4. 等 1-2 分钟，得到 URL：`https://你的用户名.github.io/bjt-trainer/`
5. 手机浏览器打开该链接
6. 安装到主屏（见下方）

### 方法 C · Vercel（更快，零配置）

1. [vercel.com](https://vercel.com) 注册（用 GitHub 账号）
2. New Project → Import 上面的 GitHub repo
3. 直接 Deploy，得到 `xxx.vercel.app` 链接
4. 手机访问，安装到主屏

## 安装到手机主屏幕

### iPhone (Safari)

1. Safari 打开 PWA 链接
2. 底部 **分享按钮**（方框带向上箭头）
3. 滑动找到 **「添加到主屏幕」**
4. 名字默认是 "BJT 訓練"，直接点 **添加**
5. 主屏多出一个粉色樱花图标 🌸

### Android (Chrome)

1. Chrome 打开 PWA 链接
2. 右上角 **菜单（三点）** → **「安装应用」**（或自动弹窗）
3. 主屏多出图标

### 安装后

- 点击图标 → **全屏打开**（看不到 Chrome/Safari 地址栏）
- 像原生 App 一样切换 tab
- 断网也能用（除了未缓存的音频）

## 文件结构

```
BJTHub/
├── index.html              # 单页应用
├── manifest.json           # PWA 元数据
├── sw.js                   # Service Worker (离线缓存)
├── icons/                  # 各尺寸图标
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   ├── apple-touch-icon.png
│   └── favicon.png
└── README.md
```

## 当前进度（v0.4.0）

### 五个训练模式 — 全部通

- ✅ **聴解** — 真实音频(34 段,涵盖公式/聴解专项 CD1+CD2/小红/ガイド),
  ▶ 播放 · 5s 跳进退 · 0.8/1.0/1.2/1.5× 变速 · AB 区间循环 · 跟读录音(MediaRecorder)
- ✅ **問題** — 30 道分组题库,按出处+题型筛选,真实判对错,自动入錯題庫
- ✅ **敬語** — 60 张 flashcard,三类敬语+读音+注解,简单 SRS(わからない/あいまい/わかった 影响下次出现频率),掌握度持久化
- ✅ **模試** — 4 套真实倒计时模考,顺序聴解→聴読解→読解,无回看,
  采点显示估算分(0-800)+J 等级+错题列表
- ✅ **復習** — 错题真实从 localStorage 取,可按"最近誤答 / 誤答回数"排序,重做正确自动出列

### PWA

- ✅ App shell + Service Worker(v0.4.0)
- ✅ manifest + 5 种主屏图标
- ✅ Google Fonts/Alpine.js 缓存,题库 JSON 预缓存
- ✅ 离线状态指示
- ✅ 安全区适配(刘海 + home indicator)

### 数据来源 + 音频策略

- `data/*.json` 种子内容(听力清单/题目/敬语/模考),仓库内,可手动扩充
- 本地开发:`audio/` 目录用软链接指向「网上买的资料」,直接播放
- 部署到 Pages 后:音频不进仓库(版权),用户首次打开在 WiFi 下用 `音源を取込` 把本机音频导入 IndexedDB,之后离线播放

## 文件结构

```
BJTHub/
├── index.html              # 单页 PWA(Alpine.js)
├── manifest.json
├── sw.js
├── data/
│   ├── listen.json         # 听力清单
│   ├── questions.json      # 题库
│   ├── keigo.json          # 敬语 flashcard
│   └── mocks.json          # 模考组合
├── audio/                  # 符号链接到「网上买的资料」音频
│   ├── chokai-cd1 → ...
│   ├── chokai-cd2 → ...
│   ├── xiaohong-slow → ...
│   ├── xiaohong-fast → ...
│   ├── guide → ...
│   └── official-full.mp3 → ...
└── icons/
```

## 手机使用流程

第一次:

1. iPhone Safari 打开 PWA 链接
2. 分享 → 「ホーム画面に追加」→ 主屏多出粉色樱花图标
3. 打开 app → 聴解 tab 顶部 → 「音源を取込 →」
4. ファイルを選択 → 在 Files app 里多选你的 m4a / mp3(可分批)
5. 文件名匹配自动入库(BJTchokai_CD1-15.m4a 这种命名直接对得上)
6. 之后离线也能播

更新代码后旧 SW 缓存自动清除(`sw.js` 改 `VERSION`):

```js
const VERSION = 'bjt-trainer-v0.5.0';
```

## 把音频从 Mac 传到 iPhone

几个无版权风险的小方法:

- **AirDrop**:Mac Finder 选音频文件 → 右键 → 共有 → AirDrop → iPhone
- **iCloud Drive**:把音频丢到 iCloud Drive 文件夹 → iPhone 的 Files app 能看到
- **直接电脑导入**:在 Mac Safari 打开 PWA → 点取込 → 选文件夹 → 同 Apple ID 下 PWA 状态会同步? 不会,IndexedDB 不跨设备同步,需在 iPhone 重新导入

## 扩充内容

- 听力:把新音频文件放到 `audio/` (或加新符号链接),编辑 `data/listen.json`
- 敬语:直接追加到 `data/keigo.json`,每条 `{id, base, yomi, sonkei, kenjo, teinei, tag, note?}`
- 题目:`data/questions.json` 是分组数组,每组 `{label, source, items:[{id, type, title, audioId?, stem, options, answer, explain}]}`
- 模考:`data/mocks.json`,引用题目 ID

