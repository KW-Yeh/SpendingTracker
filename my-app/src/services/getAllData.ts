'use server';

import { getGroups } from '@/services/groupDataActions';
import { getItems } from '@/services/recordActions';
import { getUser, putUser } from '@/services/userDataActions';

const getDefaultUser = (email: string): User => ({
  email,
  name: '',
  image: '',
  groups: [],
  budgetList: [],
});

export const getAllData = async (email: string) => {
  const { data: user } = await getUser(email);
  let userData = getDefaultUser(email);
  if (user) {
    userData = {
      ...userData,
      ...user,
    };
  } else {
    putUser(userData).then();
  }
  const { data: groups } = await getGroups(userData.groups);
  const { data: records } = await getItems(undefined, email);
  return {
    user: userData,
    groups,
    records,
  };
};
