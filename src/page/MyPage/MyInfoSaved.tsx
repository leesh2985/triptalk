import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import MySaved from './MySaved';
import { FakeUser } from '../../utils/fakerDate';

interface Save {
  id: number;
  thumbnail: string;
  title: string;
  createAt: number;
  likeCount: number;
  views: number;
  plannerId: number;
}

export default function MyInfoSaved() {
  const [savedData, setSavedData] = useState<Save[]>([]); // msw
  const [containerClassName, setContainerClassName] = useState('flex-start');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 가짜데이터
  const fakeDataSave = Array.from({ length: 2 }, _ => FakeUser());

  useEffect(() => {
    if (savedData.length >= 2) {
      setContainerClassName('flex-start');
    } else {
      setContainerClassName('space-between');
    }
  }, [savedData]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) return; // 이미 로딩 중이라면 중복 요청 방지

      setIsLoading(true);

      try {
        const Access_token = localStorage.getItem('token');
        const response = await axios.get(`/address/api/users/planners/userSave?page=0&pageSize=100`, {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        });

        const newData = response.data.content;

        if (newData.length === 0) {
          // setIsEndPage(true);
        } else {
          setSavedData(newData);
        }
      } catch (error) {
        console.error('데이터 요청 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const finalData = fakeDataSave.length > 0 ? fakeDataSave : savedData;

  return (
    <SavedContainer className={containerClassName}>
      {finalData.map(item => (
        <MySaved key={item.plannerId} savedData={item} />
      ))}
      {isLoading && <LoadingMessage>로딩 중...</LoadingMessage>}
    </SavedContainer>
  );
}

const SavedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
