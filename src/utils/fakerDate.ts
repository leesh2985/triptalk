import { faker } from '@faker-js/faker/locale/ko';

export function FakeUser() {
  const avatarSeed = Math.floor(Math.random() * 1000);
  return {
    plannerId: faker.string.uuid(), // 식별자
    nickname: faker.name.firstName(), // 닉네임
    email: faker.internet.email(), // 이메일
    thumbnail: faker.image.imageUrl(avatarSeed), // 메인사진
    profile: faker.image.avatar(), // 프로필사진
    password: faker.internet.password(), // 비번
    birthdate: faker.date.birthdate(), // 생일
    registeredAt: faker.date.past(), // 가입일
    startDate: faker.date.recent().getTime(), // 간날
    endDate: faker.date.future().getTime(), // 온날
    title: faker.lorem.words(), // 타이틀
    latitude: faker.address.latitude(), // 위도
    longitude: faker.address.longitude(), // 경도
    review: faker.lorem.paragraph(), // 사용자 후기
    createdAt: faker.date.recent(), // 게시물 등록 날짜
  };
}
