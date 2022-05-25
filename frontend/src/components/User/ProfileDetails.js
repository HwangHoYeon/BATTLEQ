import { useContext } from "react";
import { UserStateContext } from "../../context/Context";

const ProfileDetails = () => {
  const { users, setUsers } = useContext(UserStateContext);
  console.log("프로필 디테일 : ", users);

  return (
    <div className="w-full h-full p-6 flex justify-center flex-col">
      <input
        className="w-full h-1/3 mb-10 rounded-xl text-center text-3xl font-normal"
        fullWidth
        helperText="Please specify the first name"
        label="사용자"
        name="userName"
        onChange={(e) => setUsers({ ...users, userName: e.target.value })}
        required
        value={users.userName}
        variant="outlined"
      />
      <input
        className="w-full h-1/3 rounded-xl text-center text-3xl font-normal"
        fullWidth
        label="닉네임"
        name="nickname"
        onChange={(e) => setUsers({ ...users, nickname: e.target.value })}
        required
        value={users.nickname}
        variant="outlined"
      />
    </div>
  );
};

export default ProfileDetails;
