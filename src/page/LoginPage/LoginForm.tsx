// import axios from 'axios';
import KakaoLogin from '../../component/SocialLogin/KakaoLogin';
import GoogleLogin from '../../component/SocialLogin/Google';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/tokenSlice';

import styled, { css } from 'styled-components';
import { GRAY_COLOR, MAIN_COLOR } from '../../color/color';
import { Link, useNavigate } from 'react-router-dom';
import { SetStateAction, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const LoginForm = () => {
  const dispatch = useDispatch();

  const naviget = useNavigate();
  // const [userEmail, setUserEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState('triptalk@naver.com');
  const [password, setPassword] = useState('triptalk123');

  const handleEmail = (e: { target: { value: SetStateAction<string> } }) => {
    // 이메일 값 받아오기
    setUserEmail(e.target.value);
  };

  const handlePw = (e: { target: { value: SetStateAction<string> } }) => {
    // 비밀번호 값 받아오기
    setPassword(e.target.value);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log(storedToken);

    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, []);

  // 하드코딩 로그인마 시도
  const handleLogin = async () => {
    //로그인 시도
    try {
      const response = { status: 200 };

      if (response.status === 200) {
        localStorage.setItem('token', 'hardcoded_token');
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('password', password);

        // const message = '로그인 되었습니다.';
        // alert(`${message}`);
        // setUserEmail('');
        // setPassword('');
        // naviget('/main');
        Swal.fire({
          // icon: 'success',
          title: '로그인 되었습니다.',
        }).then(() => {
          setUserEmail('');
          setPassword('');
          naviget('/main');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '유효하지 않은 사용자 입니다.',
        });
      }
    } catch (error: any) {
      if (error.response.data) {
        Swal.fire({
          icon: 'error',
          title: '아이디와 비밀번호가 일치하지 않습니다.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '서버와의 연결이 끊어졌습니다.',
        });
      }
    }
  };

  // const handleLogin = async () => {
  //   //로그인 시도
  //   try {
  //     const response = await axios.post(`https://triptalk.xyz/api/users/login`, {
  //       email: userEmail,
  //       password: password,
  //     });

  //     if (response.status === 200) {
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('userEmail', userEmail);
  //       localStorage.setItem('password', password);

  //       // const message = '로그인 되었습니다.';
  //       // alert(`${message}`);
  //       // setUserEmail('');
  //       // setPassword('');
  //       // naviget('/main');
  //       Swal.fire({
  //         // icon: 'success',
  //         title: '로그인 되었습니다.',
  //       }).then(() => {
  //         setUserEmail('');
  //         setPassword('');
  //         naviget('/main');
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: '유효하지 않은 사용자 입니다.',
  //       });
  //     }
  //   } catch (error: any) {
  //     if (error.response.data) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: '아이디와 비밀번호가 일치하지 않습니다.',
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: '서버와의 연결이 끊어졌습니다.',
  //       });
  //     }
  //   }
  // };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container>
      <SocialLogin>
        <KakaoLogin />
        <GoogleLogin />
      </SocialLogin>
      <OrDivider>
        <span>또는</span>
      </OrDivider>
      <InputEmail type="email" placeholder="이메일" value={userEmail} onChange={handleEmail} />
      <br />
      <InputPw type="password" placeholder="비밀번호" value={password} onChange={handlePw} onKeyDown={handleKeyPress} />
      <LoginButton onClick={handleLogin}>로그인</LoginButton>
      <Div>
        <span>아이디 찾기</span>
        <LineSpan>비밀번호 찾기</LineSpan>
        <Link to="/signup">회원가입</Link>
      </Div>
    </Container>
  );
};

export default LoginForm;

const Container = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1250px) {
    width: 65%;
  }

  @media (max-width: 920px) {
    width: 70%;
  }
`;

const SocialLogin = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid #000;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const commonInputStyle = css`
  width: 100%;
  background-color: #e8e8e8;
  height: 70px;
  border-radius: 15px;
  padding-left: 21px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN_COLOR};
  }
  @media (max-width: 1250px) {
    font-size: 0.9rem;
  }
  @media (max-width: 430px) {
    height: 50px;
    font-size: 0.6rem;
  }
`;

const InputEmail = styled.input`
  ${commonInputStyle}
`;

const InputPw = styled.input`
  ${commonInputStyle}
`;

const LoginButton = styled.button`
  width: 100%;
  height: 60px;
  color: #fff;
  background-color: ${MAIN_COLOR};
  border: none;
  cursor: pointer;
  border-radius: 15px;
  margin-top: 36px;
  font-size: 1.5rem;
  @media (max-width: 1250px) {
    font-size: 1.3rem;
  }
  @media (max-width: 430px) {
    height: 50px;
  }
`;

const Div = styled.div`
  width: 100%;
  margin-top: 8px;
  font-size: 0.9rem;

  span {
    margin-right: 10px;
  }

  a:visited {
    color: inherit;
  }
  @media (max-width: 430px) {
    font-size: 0.7rem;
  }
`;

const LineSpan = styled.span`
  &::before,
  &::after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 12px;
    background-color: ${GRAY_COLOR};
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;
