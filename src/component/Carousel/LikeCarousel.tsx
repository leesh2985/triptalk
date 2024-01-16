import Slider, { CustomArrowProps } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { GRAY_COLOR, MAIN_COLOR } from '../../color/color';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux/es/exports';
import { RootState } from '../../store/store';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/tokenSlice';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';

interface Item {
  startDate: number;
  endDate: number;
  plannerId: number;
  thumbnail: string;
  title: string;
  nickname: string;
  views: number;
  likeCount: number;
}

function PrevArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <PrevArrowButton onClick={onClick}>
      <MdOutlineKeyboardArrowLeft />
    </PrevArrowButton>
  );
}

function NextArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <NextArrowButton onClick={onClick}>
      <MdOutlineKeyboardArrowRight />
    </NextArrowButton>
  );
}

const hardCodedData = [
  {
    startDate: new Date('2023/12/13').getTime(),
    endDate: new Date('2023/12/20').getTime(),
    plannerId: 1,
    thumbnail: 'img/5.jpg',
    title: '원데이클래스~~',
    nickname: '도레미',
    views: 100,
    likeCount: 50,
  },
  {
    startDate: new Date('2023-12-21').getTime(),
    endDate: new Date('2023-12-28').getTime(),
    plannerId: 2,
    thumbnail: 'img/6.jpg',
    title: '햅삐클스~',
    nickname: '해피캣',
    views: 120,
    likeCount: 60,
  },
  {
    startDate: new Date('2023-12-29').getTime(),
    endDate: new Date('2024-01-05').getTime(),
    plannerId: 3,
    thumbnail: 'img/2.jpg',
    title: '겨울바다',
    nickname: '지브리',
    views: 80,
    likeCount: 40,
  },
  {
    startDate: new Date('2023-01-06').getTime(),
    endDate: new Date('2023-01-13').getTime(),
    plannerId: 4,
    thumbnail: 'img/1.jpg',
    title: '바나나토스트',
    nickname: '집짱',
    views: 150,
    likeCount: 75,
  },
  {
    startDate: new Date('2023-03-14').getTime(),
    endDate: new Date('2023-03-21').getTime(),
    plannerId: 5,
    thumbnail: 'img/3.jpg',
    title: '봄은 꽃이지',
    nickname: '꿀벌',
    views: 200,
    likeCount: 100,
  },
  {
    startDate: new Date('2023-01-22').getTime(),
    endDate: new Date('2023-01-29').getTime(),
    plannerId: 6,
    thumbnail: 'img/4.jpg',
    title: '샐러드맛집',
    nickname: '헿',
    views: 90,
    likeCount: 45,
  },
];

function LikeCarousel() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  // const [data, setData] = useState<Item[]>([]);
  const [data, setData] = useState<Item[]>(hardCodedData);

  useEffect(() => {
    const Access_token = localStorage.getItem('token');
    if (Access_token) {
      dispatch(setToken(Access_token));
    }
    const fetchData = async () => {
      try {
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get('/address/api/main', config);
          const data = response.data;
          const transformedData = data.map((item: Item) => {
            const { startDate, endDate, likeCount, plannerId, thumbnail, views, title, nickname } = item;
            return { startDate, endDate, likeCount, plannerId, thumbnail, views, title, nickname };
          });
          setData(transformedData);
        }
      } catch (error) {
        console.error('API Request Failure:', error);
      }
    };
    fetchData();
  }, [token]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 430,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Container>
      <Slider {...settings}>
        {data.map((item, index) => (
          <Card key={index}>
            <Badge>{index + 1}등</Badge>
            <Link to={`/page/${item.plannerId}`} key={item.plannerId}>
              <Image src={item.thumbnail} alt="img" />
            </Link>
            <DescriptionTitle>{item.title}</DescriptionTitle>
            <DescriptionNickName>{item.nickname}</DescriptionNickName>
            <DescriptionSchedule>
              {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
            </DescriptionSchedule>
          </Card>
        ))}
      </Slider>
    </Container>
  );
}

export default LikeCarousel;

const BtnStyle = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  color: rgba(0, 0, 0, 0.9);
  font-size: 32px;
  cursor: pointer;
  position: absolute;
  z-index: 100;
  box-shadow: 0px 0px 4px ${GRAY_COLOR};
  top: 30%;
  @media (max-width: 1150px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
  }
`;

const PrevArrowButton = styled.div`
  ${BtnStyle}
  left: 0%;
  @media (max-width: 430px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
    left: 20%;
  }
`;

const NextArrowButton = styled.div`
  ${BtnStyle}
  right: 4%;
  @media (max-width: 1200px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
    right: 5%;
  }
  @media (max-width: 1024px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
    right: 5%;
  }
  @media (max-width: 900px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
    right: 5%;
  }
  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
    right: 6%;
  }
  @media (max-width: 430px) {
    width: 35px;
    height: 35px;
    font-size: 28px;
    right: 16%;
  }
`;

const Container = styled.div`
  width: 1000px;
  height: 400px;
  margin: 0 auto;
  @media (max-width: 1150px) {
    width: 90%;
    height: 300px;
  }
`;

const Card = styled.div`
  width: 280px;
  height: 400px;
  margin: 0 10px;
  @media (max-width: 1150px) {
    width: 230px;
    height: 300px;
  }
`;

const Image = styled.img`
  width: 260px;
  height: 300px;
  cursor: pointer;
  border-radius: 25px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.1);
  @media (max-width: 1150px) {
    width: 210px;
    height: 250px;
  }
  @media (max-width: 430px) {
    margin: 0 auto;
  }
`;

const DescriptionTitle = styled.div`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
  @media (max-width: 1150px) {
    font-size: 16px;
  }
  @media (max-width: 430px) {
    margin-left: 90px;
  }
`;

const DescriptionNickName = styled.div`
  font-size: 14px;
  color: gray;
  @media (max-width: 1150px) {
    font-size: 12px;
  }
  @media (max-width: 430px) {
    margin-left: 90px;
  }
`;
const DescriptionSchedule = styled.div`
  font-size: 14px;
  color: gray;
  @media (max-width: 1150px) {
    font-size: 12px;
  }
  @media (max-width: 430px) {
    margin-left: 90px;
  }
`;

const Badge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${MAIN_COLOR};
  padding: 8px;
  color: white;
  font-size: 15px;
  position: absolute;
  margin: 10px;
  top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1150px) {
    width: 35px;
    height: 35px;
    font-size: 12px;
  }
  @media (max-width: 430px) {
    margin-left: 95px;
  }
`;
