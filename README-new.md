# 🏆 Team Balancer - 공정한 팀 배정 웹앱

고등학교 동창 스크린모임에서 공정하게 팀을 나누는 웹앱입니다. 참가자 이름과 점수를 입력하면 자동으로 팀을 구성하고, 팀 간 밸런스를 시각화하여 보여줍니다.

## 🎯 주요 기능

### 🧩 기본 기능 (MVP)
- ✅ 이름·점수 입력 (멀티라인 텍스트 지원)
- ✅ 팀 수 선택 (2~6팀)
- ✅ 공정 알고리즘 (Greedy, Snake, Random)
- ✅ 팀별 카드 출력 (팀명, 총점, 평균, 구성원)
- ✅ 결과 복사 버튼
- ✅ 반응형 UI (모바일 우선)

### 🚀 고도화 기능
- 🔄 Firebase Firestore 저장 및 기록보기
- 📊 공정지표(표준편차, 점수격차, 밸런스지수%) 계산
- 🎨 팀 이름 자동 생성
- 📱 공유링크 및 PWA 지원

## 💻 기술 스택

- **Frontend:** Vite + React + TypeScript + TailwindCSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts (고도화 버전)
- **Database:** Firebase Firestore
- **Hosting:** Vercel

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone <repository-url>
cd team-balancer
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일에 Firebase 설정값을 입력하세요:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

## 📋 사용법

### 1. 참가자 입력
여러 형식을 지원합니다:
```
김철수 85
이영희,90
박민수: 75
정수연 - 80
강호동 70
```

### 2. 팀 설정
- 팀 개수: 2~6팀
- 알고리즘:
  - **그리디**: 가장 공정한 배정 (추천)
  - **스네이크**: 번갈아 가며 배정
  - **랜덤**: 완전 무작위

### 3. 결과 확인
- 밸런스 점수 (0-100점)
- 팀별 상세 정보
- 통계 지표 (표준편차, 점수차)

## 🔥 Vercel 배포 가이드

### 1. Vercel 계정 생성 및 프로젝트 연결
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 2. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수들을 설정하세요:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### 3. 커스텀 도메인 연결 (선택)
1. Vercel 대시보드 → Settings → Domains
2. 도메인 입력 후 DNS 설정
3. SSL 인증서 자동 발급

## 🗄️ Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. 웹 앱 추가 및 설정값 복사

### 2. Firestore 데이터베이스 설정
```javascript
// Firestore 보안 규칙 예시
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 매치 데이터 - 읽기 전용
    match /matches/{matchId} {
      allow read: if true;
      allow write: if true; // 프로덕션에서는 인증 필요
    }
    
    // 플레이어 기록 - 읽기 전용
    match /players/{playerId} {
      allow read: if true;
      allow write: if true; // 프로덕션에서는 인증 필요
    }
  }
}
```

### 3. Firestore 스키마

#### 📊 matches 컬렉션
```typescript
{
  id: string;
  title: string;
  date: string;
  players: Player[];
  teams: Team[];
  algorithm: 'greedy' | 'snake' | 'random';
  createdAt: number;
  updatedAt: number;
}
```

#### 👤 players 컬렉션
```typescript
{
  id: string;
  name: string;
  totalMatches: number;
  averageScore: number;
  lastScore: number;
  winRate: number;
}
```

## 📁 프로젝트 구조

```
team-balancer/
├── src/
│   ├── components/
│   │   └── TeamBalancer.tsx     # 메인 컴포넌트
│   ├── lib/
│   │   ├── firebase.ts          # Firebase 설정
│   │   └── firestore.ts         # Firestore 유틸리티
│   ├── types/
│   │   └── index.ts             # 타입 정의
│   ├── utils/
│   │   └── algorithms.ts        # 팀 배정 알고리즘
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env.example
├── vercel.json
├── tailwind.config.js
├── package.json
└── README.md
```

## 🔧 알고리즘 설명

### 1. Greedy 알고리즘 (추천)
- 점수가 높은 선수부터 순서대로 배정
- 항상 현재 총점이 가장 낮은 팀에 배정
- 가장 균형잡힌 결과 제공

### 2. Snake 알고리즘
- 1-2-3-3-2-1 순서로 번갈아 배정
- 드래프트 방식과 유사
- 순서의 공정함 보장

### 3. Random 알고리즘
- 완전 무작위 배정
- 예측 불가능한 재미있는 결과
- 밸런스 보장 안됨

## 🎨 커스터마이징

### 색상 테마 변경
`tailwind.config.js`에서 색상을 수정할 수 있습니다:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 원하는 색상으로 변경
      }
    }
  }
}
```

### 팀 이름 수정
`src/utils/algorithms.ts`에서 팀 이름 배열을 수정할 수 있습니다.

## 🐛 문제 해결

### 빌드 오류
```bash
# 캐시 삭제 후 재빌드
npm run clean
npm install
npm run build
```

### Firebase 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Firebase 프로젝트 활성화 상태 확인
- Firestore 보안 규칙 확인

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이나 피드백은 언제든 환영합니다!

---

**Made with ❤️ for fair team balancing**