# Cosmic Shooter 3D

Three.js製の3D宇宙シューティングゲームです。  
制限時間内に敵を撃破してハイスコアを目指そう！

> **Ver.1.5.0** | [プレイする（GitHub Pages）](https://junia2009.github.io/cosmic_shooter/)

## 特徴

- **3Dグラフィックス** — Three.js + Bloom（UnrealBloomPass）による美しい宇宙空間
- **スタート画面** — 自機・敵・星が動く3Dアニメーション付き
- **マルチデバイス対応** — PC（マウス/キーボード）・スマホ（タッチ操作）両対応
- **ランクシステム** — スコアに応じて S / A / B / C / D のランクを判定
- **アイテム** — 敵壊滅弾（画面内の敵を一掃）、時間プラス（残り時間+10秒）
- **4種類の敵** — それぞれ異なるスピード・スコア・外見
- **iPhoneホーム画面対応** — apple-touch-icon でカスタムアイコン表示

## 遊び方

| 操作 | PC | スマホ |
|------|-----|--------|
| 自機移動 | マウスドラッグ / 矢印キー | タッチドラッグ |
| ショット | クリック / スペースキー | タップ |

- 「START」ボタンでゲーム開始
- 制限時間 60 秒（最大 99 秒まで延長可能）
- 敵を倒してスコアを稼ごう！
- スマホは**横画面**推奨

## ランク

| ランク | スコア |
|--------|--------|
| S | 10,000 以上 |
| A | 8,000 以上 |
| B | 5,000 以上 |
| C | 3,000 以上 |
| D | 3,000 未満 |

## 動作環境

- モダンブラウザ（importmap 対応: Chrome, Edge, Firefox, Safari 最新版）
- ローカルで動かす場合は HTTP サーバー経由推奨
  - 例: `npx http-server .` / VSCode Live Server / `python -m http.server`

## 技術スタック

- **Three.js** v0.153.0（CDN via importmap）
- **EffectComposer** + **UnrealBloomPass**（ポストプロセッシング）
- **ACES Filmic Tone Mapping**
- HTML + CSS + JavaScript（単一ファイル構成）

## ファイル構成

```
index.html          ゲーム本体（HTML/CSS/JS 一体型）
icon-180.png        apple-touch-icon（180×180）
icon-512.png        高解像度アイコン（512×512）
audio/
  space_pop.mp3     スタート画面 BGM
  cyber_attack.mp3  プレイ中 BGM
README.md           このファイル
```

## BGM クレジット

- スタート画面 BGM: [Space Pop](https://dova-s.jp/bgm/play19118.html)
- プレイ中 BGM: [Cyber Attack](https://dova-s.jp/bgm/play14613.html)
- 提供: [DOVA-SYNDROME](https://dova-s.jp/)

## ライセンス

MIT License

---

ご質問・要望は Issue や PR でどうぞ！
