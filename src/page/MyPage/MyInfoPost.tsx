import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import AnotherPlanner from './AnotherPlanner';
import MyPost from './MyPost';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
import { FakeUser } from '../../utils/fakerDate';

interface userInfoDate {
  userId: number;
  name: string;
  profile: string;
  nickname: string;
  email: string;
  password: string;
  aboutMe: string;
  username: string;
  plannerId: number;
  id: number;
  thumbnail: string;
  title: string;
  createAt: number;
  likeCount: number;
  views: number;
}

interface anotheruserInfoDate {
  userId: number;
  nickname: string;
  aboutMe: string;
  profile: string;
  planners: PlannerDetails[];
}

interface PlannerDetails {
  plannerId: number;
  title: string;
  thumbnail: string;
  views: number;
  likeCount: number;
  createAt: number;
}

export default function MyInfoPost({ userInfo }: { userInfo: userInfoDate }) {
  const [postsData, setPostsData] = useState<userInfoDate[]>([]); // msw
  const [anotherpostsData, setAnotherPostsData] = useState<PlannerDetails[]>([]);
  const [containerClassName, setContainerClassName] = useState('flex-start');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const { userId } = useParams();
  const [anotherUserInfo, setAnotherUserInfo] = useState<anotheruserInfoDate>({
    userId: 0,
    nickname: '',
    aboutMe: '',
    profile: '',
    planners: [],
  });

  const anotherPlanners = anotherUserInfo.planners.map((planner: PlannerDetails) => ({
    plannerId: planner.plannerId,
    thumbnail: planner.thumbnail,
    title: planner.title,
    createAt: planner.createAt,
    likeCount: planner.likeCount,
    views: planner.views,
  }));

  // const token = useSelector((state: RootState) => state.token.token);

  // 가짜데이터
  const fakeDataPost = Array.from({ length: 3 }, _ => FakeUser());
  const fakeDataAnotherPost = Array.from({ length: 2 }, _ => FakeUser());

  useEffect(() => {
    const fetchSerch = async () => {
      if (isLoading) return; // 이미 로딩 중이라면 중복 요청 방지

      setIsLoading(true);

      try {
        const Access_token = localStorage.getItem('token');
        const response = await axios.get(`/address/api/search/user/${userId}?number=0&size=100`, {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        });

        setAnotherUserInfo(response.data);

        const newData = response.data.planners;
        if (newData.length === 0) {
        } else {
          setAnotherPostsData(newData);
        }
        console.log('anotherpostsData', anotherpostsData);
      } catch (error) {
        console.error('사용자 정보 가져오기 오류 확인바람(내정보):', error);
      }
    };

    fetchSerch();
  }, [userId]);

  useEffect(() => {
    const fetchUserPost = async () => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        const Access_token = localStorage.getItem('token');
        const response = await axios.get(`/address/api/users/planners/byUser?page=0&pageSize=100`, {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        });

        const newData = response.data.content;

        if (newData.length === 0) {
        } else {
          setPostsData(newData);
        }
      } catch (error) {
        console.error('데이터 요청 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log('게시물', postsData);
    fetchUserPost();
  }, [userId]);

  useEffect(() => {
    // 게시물 갯수에 따라 스타일 변경
    if (postsData.length >= 2 || anotherpostsData.length >= 2) {
      setContainerClassName('flex-start');
    } else {
      setContainerClassName('space-between');
    }
  }, [postsData, anotherpostsData]);

  const finalData = fakeDataPost.length > 0 ? fakeDataPost : postsData;
  const finalAnotherData = fakeDataAnotherPost.length > 0 ? fakeDataAnotherPost : anotherPlanners;

  return (
    <PostContainer className={containerClassName}>
      {userInfo.userId === anotherUserInfo.userId
        ? finalData.map(item => <MyPost key={item.plannerId} postsData={item} />)
        : finalAnotherData.map((aontherItem: PlannerDetails) => (
            <AnotherPlanner key={aontherItem.plannerId} plannerData={aontherItem} />
          ))}
      {isLoading && <LoadingMessage>로딩 중...</LoadingMessage>}
    </PostContainer>
  );
}

const PostContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: auto;
  margin-bottom: 20px;

  &.flex-start {
    justify-content: flex-start;
  }

  &.space-between {
    justify-content: space-between;
  }

  @media (max-width: 375px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const LoadingMessage = styled.p`
  font-size: 36px;
  font-weight: bold;
`;
