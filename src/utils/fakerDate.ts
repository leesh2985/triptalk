import { faker } from '@faker-js/faker/locale/ko';
import moment from 'moment';

export function FakeUser() {
  const avatarSeed = Math.floor(Math.random() * 1000);
  const numPlannerDetails = faker.datatype.number({ min: 1, max: 3 }); // 포스트박스

  const plannerDetailResponse = Array.from({ length: numPlannerDetails }, (_, index) => {
    // const numImages = faker.datatype.number({ min: 1, max: 3 }); //이미지갯수

    return {
      userId: faker.datatype.number({ min: 1, max: 6 }),
      plannerDetailId: index + 1,
      date: moment(faker.date.recent().getTime()).format('YYYY-MM-DD'),
      placeResponse: {
        placeName: faker.address.city(),
        roadAddress: faker.address.streetAddress(),
        addressName: faker.address.streetName(),
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
      description: faker.lorem.sentence(),
      // imagesUrl: Array.from({ length: numImages }, () => faker.image.imageUrl(avatarSeed + index)),
      imagesUrl: [faker.image.imageUrl(avatarSeed + index)],
    };
  });

  return {
    plannerId: faker.datatype.number({ min: 1, max: 6 }), // 식별자
    plannerDetailId: faker.datatype.number({ min: 1, max: 32 }), // 상세페이지 번호
    nickname: faker.name.firstName(), // 닉네임
    email: faker.internet.email(), // 이메일
    thumbnail: faker.image.imageUrl(avatarSeed), // 메인사진
    profile: faker.image.avatar(), // 프로필사진
    userId: faker.datatype.number({ min: 1, max: 6 }), // 아이디
    password: faker.internet.password(), // 비번
    startDate: moment(faker.date.recent().getTime()).format('YYYY-MM-DD'), // 간날
    endDate: moment(faker.date.future().getTime()).format('YYYY-MM-DD'), // 온날
    title: faker.lorem.words(), // 타이틀
    latitude: Number(faker.address.latitude()), // 위도
    longitude: Number(faker.address.longitude()), // 경도
    description: faker.lorem.paragraph(), // 사용자 후기
    createAt: faker.date.recent().getTime(), // 게시물 등록 날짜
    views: faker.number.int({ min: 10, max: 100 }), // 조회수
    likeCount: faker.number.int({ min: 10, max: 100 }), // 좋아요 수
    image: [faker.image.imageUrl(avatarSeed)], // 이미지
    date: faker.date.recent().toISOString(),
    place: faker.address.city(), // 장소이름
    aboutMe: faker.lorem.words(), // 소개
    id: faker.datatype.number({ min: 0, max: 6 }),
    plannerDetailResponse,
  };
}
