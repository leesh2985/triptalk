import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GRAY_COLOR, LIGHT_GRAY_COLOR, LIGHT_ORANGE_COLOR, MAIN_COLOR } from '../../../color/color';
import EditForm from './EditForm';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import EditIntroduct from './EditIntroduct';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setEditedAboutMe, setEditedNewPassword, setEditedNickname } from '../../../store/editMyInfoSlice';
import { RootState } from '../../../store/store';
import { LuSettings } from 'react-icons/lu';

export default function EditMyInfo() {
  const navigate = useNavigate();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // 버튼 활성화 상태 추가
  const [userImg, setUserImg] = useState('/img/profile.png');
  const imgRef = useRef<HTMLInputElement | null>(null); // 초기에는 아무것도 가르키고 있지 않음
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImg, setCurrentImg] = useState('');
  const [userUniqueId, setUserUniqueId] = useState('');

  const dispatch = useDispatch();

  const editedNickname = useSelector((state: RootState) => state.editMyInfo.editedNickname);
  const editedNewPassword = useSelector((state: RootState) => state.editMyInfo.editedNewPassword);
  const editedAboutMe = useSelector((state: RootState) => state.editMyInfo.editedAboutMe);
  const currentEmail = useSelector((state: RootState) => state.editMyInfo.currentEmail);

  const token = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    const Access_token = localStorage.getItem('token');
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/address/api/users/profile', {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        });

        if (response.data) {
          const { profile, userId } = response.data;
          setUserImg(profile);
          setCurrentImg(profile);
          setUserUniqueId(userId);
        } else {
          console.log(response);
          alert('사용자 정보가 없습니다 사진');
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 오류 확인바람(프로필):', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file && file.length > 0) {
      const changeImg = file[0];
      setSelectedFile(changeImg);
      const imageUrl = URL.createObjectURL(file[0]);
      setUserImg(imageUrl);
      console.log('setSelectedFile:', changeImg);
      console.log('userImg:', userImg);
    }
  };

  const handleInputImageClick = () => {
    // 사용자가 선택한 파일 업로드가 나타남
    imgRef.current?.click();
  };

  useEffect(() => {
    // 모든 정보가 입력되었을 때 버튼을 활성화
    if (editedNickname && editedNewPassword && editedAboutMe) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [editedNickname, editedNewPassword, editedAboutMe]);

  const handleNicknameChange = (newNickname: string) => {
    dispatch(setEditedNickname(newNickname));
  };

  const handleNewPasswordChange = (newPassword: string) => {
    dispatch(setEditedNewPassword(newPassword));
  };

  const handleAboutMeChange = (newAboutMe: string) => {
    dispatch(setEditedAboutMe(newAboutMe));
  };

  const handleUsrsEditButtonClick = async () => {
    // localStorage.removeItem('userInfo');
    //  localStorage.setItem('userInfo', JSON.stringify(updatedUserData));

    if (!selectedFile) {
      console.error('이미지가 선택되지 않았습니다.');
      return;
    }
    const formData = new FormData();
    formData.append('files', selectedFile);

    try {
      const response = await axios.post('/address/api/images', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('이미지 업로드 성공:', response.data);

        const imageUrls = response.data[0];

        console.log(selectedFile);

        const requestData = {
          email: currentEmail,
          newPassword: editedNewPassword,
          newNickname: editedNickname,
          newAboutMe: editedAboutMe,
          newImage: imageUrls,
          oldImage: currentImg,
        };
        console.log(imageUrls);
        console.log(requestData);

        try {
          const infoResponse = await axios.put('/address/api/users/update/profile', requestData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (infoResponse.status === 200) {
            console.log('정보 업로드 성공:', infoResponse.data);
            navigate(`/myinfo/${userUniqueId}`);
          } else {
            alert('정보 업로드 실패');
          }
        } catch (error) {
          console.error('정보 업로드 오류:', error);
        }
      } else {
        console.error('이미지 업로드 서버 응답 오류:', response);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    }
  };

  // const handleBackButtonClick = () => {
  //   navigate(`/myinfo/${userUniqueId}`); // 이전 페이지로 이동
  // };

  const handleBackButtonClick = () => {
    navigate(-1); // 가짜데이터연결용
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('정말로 회원 탈퇴하시겠습니까?');

    if (confirmDelete) {
      try {
        const DeleteAccountResponse = await axios.delete('/address/api/users/update/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (DeleteAccountResponse.status === 200) {
          navigate('/');
        } else {
          alert('탈퇴에 실패했습니다.');
        }
      } catch (error) {
        console.error('탈퇴 요청 오류:', error);
        alert('탈퇴 요청 중에 오류가 발생했습니다.');
      }
    }
  };

  return (
    <InfoContainer>
      <InfoTitle>개인정보수정</InfoTitle>
      <InfoEditContainer>
        <ImgEditContainer>
          <ProfileImgContainer method="post" encType="multipart/form-data">
            <ProfileImgLabel htmlFor="profileImg">
              <ProfileImgInput type="file" accept="image/*" id="profileImg" onChange={handleImageUpload} ref={imgRef} />
              <EditProfileBtn type="button" onClick={handleInputImageClick}>
                <LuSettings />
              </EditProfileBtn>
            </ProfileImgLabel>
            <PreviewImage src={userImg} alt="프로필 이미지" />
          </ProfileImgContainer>
          <ExitBtn onClick={handleDeleteAccount}>탈퇴하기</ExitBtn>
        </ImgEditContainer>

        <IntroductionContainer>
          <EditIntroduct onAboutMeChange={handleAboutMeChange} />
        </IntroductionContainer>

        <MyInfoEditForm>
          <EditForm onNicknameChange={handleNicknameChange} onNewPasswordChange={handleNewPasswordChange} />
        </MyInfoEditForm>

        <MyInfoBtnSetting>
          <EditBtn type="submit" onClick={handleUsrsEditButtonClick} disabled={!isButtonEnabled}>
            수정하기
          </EditBtn>
          <CancelBtn onClick={handleBackButtonClick}>취소</CancelBtn>
        </MyInfoBtnSetting>
      </InfoEditContainer>
    </InfoContainer>
  );
}

const InfoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
`;

const InfoTitle = styled.p`
  font-size: 50px;
  font-weight: 700;
`;

const ProfileImgContainer = styled.form`
  position: relative;
`;

const ProfileImgLabel = styled.label`
  font-size: 13px;
  display: inline-block;
`;

const ProfileImgInput = styled.input`
  display: none;
`;

const EditProfileBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 50px;
  height: 50px;
  top: 80%;
  left: 90%;
  transform: translate(-50%, -50%);
  border: 1px solid ${LIGHT_GRAY_COLOR};
  border-radius: 100%;
  background-color: #fff;
  font-size: 50px;
  z-index: 1;
  cursor: pointer;
`;

const PreviewImage = styled.img`
  width: 300px;
  height: 300px;
  border: 1px solid ${LIGHT_GRAY_COLOR};
  border-radius: 100%;

  @media (max-width: 768px) {
    width: 260px;
    height: 260px;
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const InfoEditContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 70px 55px;
  column-gap: 50px;
  row-gap: 40px;
  grid-template-areas:
    'ImgEditContainer MyInfoEditForm'
    'IntroductionContainer MyInfoEditForm'
    'MyInfoBtnSetting MyInfoBtnSetting';
  padding-top: 50px;
`;

const ImgEditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  grid-area: ImgEditContainer;
`;

const IntroductionContainer = styled.div`
  grid-area: IntroductionContainer;
  display: flex;
  justify-content: center;
`;

const ExitBtn = styled.button`
  font-size: 15px;
  border: none;
  background-color: transparent;
  text-decoration: underline;
  margin-top: 30px;
  cursor: pointer;
`;

const MyInfoEditForm = styled.form`
  display: flex;
  flex-direction: column;
  grid-area: MyInfoEditForm;
  justify-content: center;
`;

const MyInfoBtnSetting = styled.div`
  display: flex;
  justify-content: center;
  grid-area: MyInfoBtnSetting;
`;

const SettingBtnStyle = css`
  width: 120px;
  height: 55px;
  border: none;
  border-radius: 15px;
  font-size: 15px;
`;

const EditBtn = styled.button`
  ${SettingBtnStyle}
  background-color: ${MAIN_COLOR};
  color: #fff;
  margin-right: 25px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:disabled {
    background-color: ${LIGHT_ORANGE_COLOR};
  }
`;

const CancelBtn = styled.button`
  ${SettingBtnStyle}
  background-color: ${LIGHT_GRAY_COLOR};
  color: ${GRAY_COLOR};
  cursor: pointer;
`;
