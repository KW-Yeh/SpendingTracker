import { USER_TOKEN_SEPARATOR } from '@/utils/constants';

export const handleFormatUserToken = (email: string, groupId?: string) => {
  let userToken = email;
  if (groupId) {
    userToken += USER_TOKEN_SEPARATOR + groupId;
  }
  return userToken;
};
