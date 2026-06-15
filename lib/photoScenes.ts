// =============================================================
// Write About the Photo の本番制限時間。
// 以前あった固定24シーン（あらかじめ用意した写真・模範解答）は廃止し、
// 毎日のお題は Routine が生成する public/daily-photo.json を読む（lib/dailyPhoto.ts）。
// =============================================================

// DET の Write About the Photo は制限時間 1 分
export const PHOTO_TIME_LIMIT_SEC = 60;
