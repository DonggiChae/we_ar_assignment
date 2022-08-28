#WE_AR 과제

## 과제 결과 (CODEPEN) 
[CODEPEN](https://codepen.io/donggichae/pen/qBozXxz).

## 과제의 주요 목표

- [x] 캔버스 사이즈는 가로 1000, 세로 500 고정입니다.

![canvas](https://user-images.githubusercontent.com/69336797/187089451-95899ced-1070-4ada-b50f-bcc7ca84eccf.png)
html에서 canvas를 만들었습니다. 그리고 css 에서 크기를 지정하였습니다.

- [x] 스테이지에 10 ~ 20개의 공이 랜덤한 위치에 생성됩니다.

![random](https://user-images.githubusercontent.com/69336797/187089555-3e965b45-bd09-4a4d-9d36-5f75f7b9563e.png)

랜덤하게 수를 생성하는 함수를 만들어서 공의 개수를 랜덤하게 생성되도록하였습니다.

- [x] 0 ~ 360 사이의 랜덤한 각도로 공이 날아갑니다.
- [x] 200 ~ 400px/s 사이의 랜덤한 속도를 가집니다.


![vector](https://user-images.githubusercontent.com/69336797/187091124-33cffb03-1a9e-4a87-ba08-e7f532eb7449.png)


Vector 처럼 0 ~ 1 사이의 값과 1 또는 -1 을 곱해주어 x,y 값을 정해서 공이 날아가는 방향을 정하였습니다.
100 fps 기준으로 속도값을 설정하였습니다. 그래서 설정한 fps에 따라 속도가 바뀌도록 하였습니다.

- [x] 10 ~ 20px 사이의 랜덤한 반지름을 가집니다.

![random](https://user-images.githubusercontent.com/69336797/187089555-3e965b45-bd09-4a4d-9d36-5f75f7b9563e.png)

공의 개수를 만든 함수를 같이 사용하였습니다. 
공이 생성될 때 크기가 정해 지도록 하였습니다. 


- [x] 벽과 부딪힐경우 반사각으로 튕겨져 나갑니다.

![WallCollision](https://user-images.githubusercontent.com/69336797/187091204-fc9f4218-0b47-41fd-bdd0-25601f41613e.png)
 
 상하, 좌우 벽을 나누어 부딪힐 경우 반사각으로 튕겨나가도록 하였습니다.
 

- [x] 공과 공이 부딪힐경우 반사각으로 튕겨져 나갑니다.
![distance](https://user-images.githubusercontent.com/69336797/187091283-33cedff7-40d6-4df5-a384-143ab5035b84.png)

distance 변수는 두 개의 공의 각각의 위치에 속력이 더해졌을 때 겹치게 되면 충돌이 된다고 가정하였습니다.
부딪히게 된다면 새로운 속도를 설정하였습니다. 

distanceCenterToCenter 변수는 처음 공이 생성될 때 겹쳐서 생성되는 경우를 방지하기 위해 추가하였습니다.


![Elastic_collision](https://user-images.githubusercontent.com/69336797/187091381-ade45a55-78e8-4a96-b7ca-79c7d6a32f00.png)

공과 공이 충돌하였을때 [Elastic_collision](https://en.wikipedia.org/wiki/Elastic_collision) 식을 이용하였습니다. (질량을 고려하지 않았습니다.)

## 개발 가이드

- [x] 순수하게 TypeScript만 사용하여 제작 해주세요.
- OOP를 효율적으로 사용하세요.


- [x] 랜덤하게 정해진 공의 속도는 어느 환경에서도 일정해야합니다.
- [x] `requestAnimationFrame` 을 사용해서 프레임 루프를 구현하세요.

![Throttle](https://user-images.githubusercontent.com/69336797/187091703-669a6930-d65b-4a8b-aa54-d36c9a16891f.png)

requestAnimationFrame을 사용하였습니다. 그러나 프레임 단위로 화면을 보여주기 떄문에 화면의 프레임에 따라 결과가 달라지는 것을 확인할 수 있었습니다.
이를 방지하기 위해서 Throttle울 사용하여 어느 상황에서도 같은 결과를 나타내도록 하였습니다.


- [x] `HTMLCanvasElement`를 사용하여 화면을 구현하세요.

![HTMLCanvasElement](https://user-images.githubusercontent.com/69336797/187091787-d708a3fb-9e3d-4754-8097-b955b3604edc.png)



- [x] 소스코드는 github을 통해 제출해주세요.
