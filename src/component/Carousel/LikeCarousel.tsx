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
// import formatDate from '../../utils/formatDate';
import { FakeUser } from '../../utils/fakerDate';
import moment from 'moment';

interface Item {
  startDate: string;
  endDate: string; // 형식 numder-> string
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

function LikeCarousel() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<Item[]>([]);

  // 가짜데이터
  const fakeDataTop = Array.from({ length: 6 }, _ => FakeUser());

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

  const finalData = fakeDataTop.length > 0 ? fakeDataTop : data;

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

  function formatDate(date: moment.MomentInput) {
    return moment(date).format('YYYY-MM-DD');
  } // moment라이브러리사용

  return (
    <Container>
      <Slider {...settings}>
        {finalData.map((item, index) => (
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
