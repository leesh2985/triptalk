import { Link } from 'react-router-dom';
import styled from 'styled-components';
import formatDate from '../../utils/formatDate';
import { BsEyeFill, BsFillSuitHeartFill } from 'react-icons/bs';

interface Item {
  createAt: number;
  likeCount: number;
  plannerId: number;
  thumbnail: string;
  views: number;
  title: string;
}

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link to={`/page/${item.plannerId}`} key={item.plannerId}>
      <StyledPost>
        <div className="info-container">
          <TopContainer>
            <IconWithCount>
              <Heart />
              <Count>{item.likeCount || '0'}</Count>
            </IconWithCount>
            <IconWithCount>
              <LookUp />
              <Count>{item.views || '0'}</Count>
            </IconWithCount>
          </TopContainer>
          <MiddleTitleContainer>{item.title}</MiddleTitleContainer>
          <BottomContainer>
            <DateLabel> {formatDate(item.createAt)} </DateLabel>
          </BottomContainer>
        </div>
        <Img src={item.thumbnail} alt="Post Image" />
      </StyledPost>
    </Link>
  );
}

const StyledPost = styled.div`
  width: 100%;
  height: 440px;
  position: relative;
  cursor: pointer;
  border-radius: 25px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .info-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 25px;
    display: none;
    color: white;
  }

  &:hover .info-container {
    display: block;
  }
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Heart = styled(BsFillSuitHeartFill)`
  width: 30px;
  height: 30px;
`;

const IconWithCount = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const Count = styled.div`
  margin-left: 5px;
`;

const LookUp = styled(BsEyeFill)`
  width: 30px;
  height: 30px;
`;

const MiddleTitleContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 20%;
  font-size: 24px;
  font-weight: bold;
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
`;

const DateLabel = styled.div`
  font-size: 24px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
