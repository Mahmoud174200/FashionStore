import { useLocalSearchParams } from "expo-router";
import ProductPage from "../../screens/ProductPage";
import { getCurrentUserUuid } from "../../firebase/users";
import { useState,useEffect } from "react";
import { checkUserRating } from "../../firebase/Rates";

export default function Page() {

  const [userId, setUserId] = useState(null);
  const [hasRatedd, setHasRatedd] = useState(false);


  const { id } = useLocalSearchParams() || { id: 'defaultId' };

  useEffect(() => {
    getCurrentUser();
    checkUserRatingStatus();
  }, []);

  const getCurrentUser = async () => {
    const currentUser = await getCurrentUserUuid();
    setUserId(currentUser);
  };
  const checkUserRatingStatus = async () => {
    try {
      const hasUserRated = await checkUserRating(userId, id); 
      setHasRatedd(hasUserRated);
    } catch (error) {
      console.error('Error checking user rating status:', error);
    }
  };
  return <ProductPage id={id} hasRatedd={hasRatedd} />;
}