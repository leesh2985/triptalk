import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../../store/tokenSlice';
import { RootState } from '../../store/store';
import Header from '../../component/Header';
import SecheduleSelect from '../../component/SecheduleSelect/SecheduleSelect';
import TopButton from '../../component/TopButton/TopButton';
import styled from 'styled-components';
import { DEFAULT_FONT_COLOR } from '../../color/color';
import axios from 'axios';
import ItemCard from '../../component/Sechedule/ItemCard';
import { FakeUser } from '../../utils/fakerDate';

interface Item {
  createAt: number;
  likeCount: number;
  plannerId: number;
  thumbnail: string;
  views: number;
  title: string;
}

function Schedule() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSortType = searchParams.get('sortType') || 'RECENT';
  const [sortType, setSortType] = useState(initialSortType);
  const [data, setData] = useState<Item[]>([]);
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const token = useSelector((state: RootState) => state.token.token);
  const [page, setPage] = useState(0);
  const previousToken = useRef<string | null>(null);
  const previousPage = useRef<number | null>(null);
  const previousSortType = useRef<string | null>(null);

  const fakeUsers = [];

  for (let i = 0; i < 10; i++) {
    const fakeUser = FakeUser();
    fakeUsers.push(fakeUser);
  }

  useEffect(() => {
    if (token === null) {
      const Access_token = localStorage.getItem('token');
      if (Access_token) {
        dispatch(setToken(Access_token));
      }
      return;
    }
    if (previousToken.current === token && previousPage.current === page && previousSortType.current === sortType) {
      return;
    }
    previousToken.current = token;
    previousPage.current = page;
    previousSortType.current = sortType;

    setIsLoading(true);

    const fetchData = async () => {
      try {
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`/address/api/plans?page=${page}&size=6&sortType=${sortType}`, config);
          const fetchedData = response.data;
          setHasNext(fetchedData.hasNext);
          const transformedData = fetchedData.plannerListResponses.content.map((item: Item) => {
            const { likeCount, plannerId, thumbnail, views, createAt, title } = item;
            return { likeCount, plannerId, thumbnail, views, createAt, title };
          });
          setData(prevData => [...prevData, ...transformedData]);
          setVisibleItems(prevItems => [...prevItems, ...transformedData.slice(0, 6)]);
          if (!fetchedData.hasNext) {
            setAllItemsLoaded(true);
          }
        }
      } catch (error) {
        console.error('API Request Failure:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, page, sortType]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleItems, isLoading]);

  const handleScroll = () => {
    const scrollY = window.pageYOffset;

    const pageHeight = document.body.offsetHeight;

    const windowHeight = window.innerHeight;

    if (scrollY + windowHeight >= pageHeight - 100 && !isLoading) {
      loadMoreItems();
    }

    if (scrollY > 100 && !isLoading) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }
  };

  const loadMoreItems = () => {
    if (!hasNext) {
      setAllItemsLoaded(true);
      return;
    }
    setPage(prevPage => prevPage + 1);
  };

  const handleSortChange = (sortKey: string) => {
    let newSortType;
    switch (sortKey) {
      case '최신순':
        newSortType = 'RECENT';
        break;
      case '좋아요':
        newSortType = 'LIKES';
        break;
      case '조회순':
        newSortType = 'VIEWS';
        break;
      default:
        newSortType = 'RECENT';
    }
    setSortType(newSortType);
    setData([]);
    setVisibleItems([]);
    setPage(0);
    setAllItemsLoaded(false);
    setSearchParams({ sortType: newSortType });
  };

  useEffect(() => {
    const currentSortType = searchParams.get('sortType');
    if (currentSortType && ['RECENT', 'LIKES', 'VIEWS'].includes(currentSortType)) {
      setSortType(currentSortType);
    }
  }, [searchParams]);

  const finalData = fakeUsers.length > 0 ? fakeUsers : data;

  return (
    <>
      <Header />
      <MainContainer>
        <TitleContainer>
          <Title>여러분의 일정을 보여주세요!</Title>
          <SelectBox>
            <SecheduleSelect onSortChange={handleSortChange} currentSortType={sortType} />
          </SelectBox>
          <EditButton to="/addSchedule">일정등록하기</EditButton>
        </TitleContainer>
        <GridContainer>
          {finalData.map(item => (
            <ItemCard key={item.plannerId} item={item} />
          ))}
        </GridContainer>
        {isLoading && <LoadingMessage>Loading...</LoadingMessage>}
        {!isLoading && allItemsLoaded && <EndOfDataMessage>게시물이 더상 존재하지 않습니다.</EndOfDataMessage>}
        {showTopButton && <TopButton />}
      </MainContainer>
    </>
  );
}

export default Schedule;

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  user-select: none;

  @media (max-width: 430px) {
    padding: 0 10px;
  }
`;

const TitleContainer = styled.div`
  margin: 0 auto;
  max-width: 96%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 950px) {
    max-width: 90%;
  }

  @media (max-width: 430px) {
    max-width: 90%;
  }
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: bold;

  @media (max-width: 1250px) {
    font-size: 20px;
  }
  @media (max-width: 950px) {
    font-size: 18px;
  }
  @media (max-width: 600px) {
    font-size: 16px;
    margin-right: 60px;
  }
  @media (max-width: 430px) {
    font-size: 14px;
    margin-right: 45px;
  }
`;

const SelectBox = styled.div`
  width: 200px;

  @media (max-width: 1250px) {
    width: 160px;
  }
  @media (max-width: 900px) {
    width: 140px;
  }
  @media (max-width: 600px) {
    width: 120px;
  }
  @media (max-width: 430px) {
    width: 100px;
  }
`;

const GridContainer = styled.div`
  width: 100%;
  display: grid;
  min-height: 100vh;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 0 20px;

  @media (max-width: 600px) {
    gap: 10px;
  }

  @media (max-width: 430px) {
    padding: 0 10px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;

  @media (max-width: 600px) {
    font-size: 20px;
  }

  @media (max-width: 430px) {
    font-size: 18px;
  }
`;

const EditButton = styled(Link)`
  width: 200px;
  height: 50px;
  color: ${DEFAULT_FONT_COLOR};
  background-color: inherit;
  margin-left: 150px;
  border: 1px solid black;
  border-radius: 15px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;

  @media (max-width: 1250px) {
    width: 180px;
    font-size: 14px;
  }
  @media (max-width: 900px) {
    width: 160px;
    font-size: 12px;
  }
  @media (max-width: 600px) {
    width: 140px;
    font-size: 10px;
  }
  @media (max-width: 430px) {
    width: 120px;
    font-size: 8px;
    margin-left: 100px;
  }
`;

const EndOfDataMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;

  @media (max-width: 1250px) {
    font-size: 20px;
  }
  @media (max-width: 900px) {
    font-size: 18px;
  }
  @media (max-width: 600px) {
    font-size: 16px;
  }
  @media (max-width: 430px) {
    font-size: 14px;
  }
`;
