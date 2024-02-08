import moment from 'moment';
import { BiTime } from 'react-icons/bi';
import { GrLocation } from 'react-icons/gr';
import styled, { css } from 'styled-components';
import PopupImgs from '../../component/Carousel/PopupImgs';

interface TravelPostData {
  plannerDetailId: number;
  nickname: string;
  profile: string;
  description: string;
  image: string[];
  place: string;
  date: string;
  views: number | null;
  likeCount: number | null;
  latitude: number;
  longitude: number;
}

interface TravelPopupProps {
  data: TravelPostData | null;
  onClose: () => void;
}

export default function TravelPopup({ data, onClose }: TravelPopupProps) {
  if (!data) {
    return null;
  }

  return (
    <Popup onClick={onClose}>
      <PopupContent>
        <PopupImgDiv>
          <PopupImgs image={data.image} />
        </PopupImgDiv>
        <PopupInfo>
          <Top>
            <PopupNickname>
              <UserProfile src={data.profile} />
              {data.nickname}
            </PopupNickname>
            <PopupDate>
              <Time />
              {moment(data.date, 'YYYY-MM-DDTHH:mm:ss').add(9, 'hours').format('YYYY-MM-DD HH:mm')}
            </PopupDate>
          </Top>
          <Middle>
            <PopupReview>{data.description}</PopupReview>
          </Middle>
          <Button>
            <PopupAddress>
              <Location />
              {data.place}
            </PopupAddress>
          </Button>
        </PopupInfo>
        {/* <CloseButton onClick={onClose}>닫기</CloseButton> */}
      </PopupContent>
    </Popup>
  );
}

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
`;

const PopupContent = styled.div`
  background: #fff;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PopupImgDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
`;

const PopupInfo = styled.div`
  width: 100%;
  margin: 25px 0 0;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Middle = styled.div`
  display: flex;
`;

const Button = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserProfile = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 100%;
  background-color: #fff;
  margin-right: 10px;
`;

const PopupNickname = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 0 0 10px;
`;

const PopupReview = styled.div`
  margin: 15px 0;
  font-size: 23px;
`;

const PopupAddress = styled.div`
  font-size: 16px;
  margin: 0 0 10px;
  font-weight: 700;
`;

const PopupDate = styled.div`
  font-size: 16px;
`;

const IconStyle = css`
  font-size: 15px;
  padding-right: 5px;
  color: #000;
`;

const Time = styled(BiTime)`
  ${IconStyle}
`;

const Location = styled(GrLocation)`
  ${IconStyle}
`;

// const CloseButton = styled.button`
//   background: transparent;
//   border: none;
//   color: #fff;
//   font-size: 24px;
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   cursor: pointer;
// `;
