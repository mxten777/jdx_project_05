## 🛠️ 커스터마이징 & 실전 확장 팁

- **브랜딩 컬러/로고/폰트**: tailwind.config.js에서 색상, 폰트, 그림자, radius 등 자유롭게 변경. AppHeader/AppFooter에 로고/브랜드명 교체.
- **컴포넌트화**: src/components 내 모든 UI를 props 기반으로 분리, 재사용/확장 가능. 예) PlayerInputSection → 다양한 입력폼, TeamResultSection → 대시보드 카드 등.
- **알고리즘 교체/추가**: utils/algorithms.ts에 팀 배정, 점수 산정, 깍두기팀 선정 등 로직을 자유롭게 추가/교체. (예: 점수 가중치, 조건부 배정 등)
- **다국어/다문화 지원**: i18n(react-i18next 등) 적용 시, 안내문구/라벨/버튼을 다국어로 확장 가능.
- **테마/다크모드**: Tailwind 다크모드, 커스텀 테마(예: seasonal, corporate 등) 쉽게 적용.
- **외부 연동**: lib/에 API 연동, 인증, DB, 소셜 로그인 등 추가 가능.
- **모바일/PC 최적화**: Tailwind 반응형 유틸리티(sm, md, lg, xl)로 모바일/태블릿/PC 완벽 대응.
- **배포/운영**: Vercel, Netlify, AWS 등 어디든 배포 가능. 환경별 .env, CI/CD, 프리뷰/롤백 활용.
- **테스트/품질**: Jest, React Testing Library 등으로 컴포넌트/로직 단위 테스트 추가 권장.

---

> **실전 TIP:**
> - 템플릿을 복제 후, src/components/와 tailwind.config.js만 바꿔도 완전히 다른 서비스/브랜드로 빠르게 전환 가능!
> - 알고리즘/로직만 교체하면, 팀 배정 외에도 다양한 조합/분배/시뮬레이션 서비스로 확장 가능!
# JDX Team Balancer - 프리미엄 UI/UX 템플릿 구조 및 기술스택

## 🏗️ 기술스택
- **Frontend Framework:** React (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (커스텀 프리미엄 컬러 팔레트, 다크모드 지원)
- **State Management:** React useState/useEffect (필요시 Context API 확장 가능)
- **Routing:** react-router-dom (멀티페이지 확장 가능)
- **배포:** Vercel (CI/CD, 프리뷰/프로덕션 분리)
- **버전관리:** Git (GitHub)

## 🗂️ 폴더/파일 구조 (예시)
```
├── public/
├── src/
│   ├── assets/           # 이미지, 폰트 등 정적 리소스
│   ├── components/       # UI 컴포넌트 (헤더, 푸터, 입력, 결과 등)
│   ├── lib/              # 외부 연동/유틸리티
│   ├── types/            # 타입 정의 (TypeScript)
│   ├── utils/            # 알고리즘, 파서 등 핵심 로직
│   ├── App.tsx           # 메인 엔트리
│   └── main.tsx          # Vite 엔트리
├── tailwind.config.js    # 프리미엄 컬러/폰트/반응형 설정
├── index.html            # 폰트/SEO/메타
├── package.json          # 의존성/스크립트
└── ...
```

## 🎨 프리미엄 컬러톤 & 폰트
- **컬러:** 네이비(#1e3a8a), 골드(#ffd700, #b8860b), 화이트, 블랙, 그라데이션
- **폰트:** Pretendard, Montserrat, Noto Sans KR, Inter (Tailwind 커스텀 font-premium)
- **UI:** 카드/버튼/입력란 모두 라운드, 그림자, 그라데이션, 여백 강조
- **모바일:** sm, md, lg 반응형 Tailwind 유틸리티 적극 활용

## 🧩 주요 컴포넌트
- `AppHeader` / `AppFooter`: 로고, 타이틀, 프리미엄 컬러/폰트/그라데이션
- `PlayerInputSection`: 참가자 입력, 안내문구, 반응형
- `TeamSettingsSection`: 팀/알고리즘 선택, (확장: 추가 옵션)
- `TeamResultSection`: 팀 결과 카드, 깍두기팀, 밸런스 점수
- `utils/algorithms.ts`: 팀 배정, 깍두기팀 랜덤 선정, 점수 파싱 등 핵심 로직

## 🚀 확장/활용 가이드
- **색상/폰트/레이아웃**: tailwind.config.js에서 손쉽게 커스텀 가능
- **컴포넌트 재사용**: src/components 내 분리, props로 확장성 확보
- **로직 확장**: utils/에 알고리즘, 파서, 외부 API 연동 등 추가
- **모바일/PC 완벽 대응**: Tailwind 반응형 유틸리티 적극 활용
- **배포/프리뷰**: Vercel로 빠른 배포 및 롤백, 환경별 분리

---

> 이 구조와 스타일을 기반으로 다양한 프리미엄 서비스, 대시보드, 팀/조직 관리, 이벤트 앱 등으로 확장 가능합니다.
> 
> **템플릿 활용시, tailwind.config.js와 src/components/ 구조를 참고하세요!**
