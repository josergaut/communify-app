import React, { useEffect, useState } from "react";
import { List, Space } from "antd";
import {
  ImprovementClaim,
  OnRemoveArg,
  OnSubmitArg,
  ProfileSubscriptionsProps,
  SingleInputFormData,
  TierWithParentCampaign,
} from "../types/types";
import SingleFormInput from "./SingleFormInput";

const ProfileSubscriptions: React.FC<ProfileSubscriptionsProps> = (
  props: ProfileSubscriptionsProps,
  context,
) => {
  const [singleInputFormData, setSingleInputFormData] = useState<
    SingleInputFormData[]
  >([]);
  const [onSubmitState, setOnSubmitState] = useState<
    (submit: OnSubmitArg) => void
  >(() => (submit: OnSubmitArg) => {});
  const [onRemoveState, setOnRemoveState] = useState<
    (submit: OnRemoveArg) => void
  >(() => (remove: OnRemoveArg) => {});
  useEffect(() => {
    setSingleInputFormData(
      combineEntitledTiersWithClaims(
        props.currentlyEntitledTiers,
        props.improvementClaims,
      ),
    );
    setOnSubmitState(props.onSubmit);
    setOnRemoveState(props.onRemove);
  }, [props]);

  const combineEntitledTiersWithClaims = (
    currentlyEntitledTiers: TierWithParentCampaign[],
    improvementClaims: ImprovementClaim[],
  ): SingleInputFormData[] => {
    return currentlyEntitledTiers.map((cet) => {
      const claim = improvementClaims.find(
        (c) =>
          c.campaignId === cet.parentCampaign.id && c.tierId === cet.tier.id,
      );
      if (claim) {
        return {
          campaignId: cet.parentCampaign.id,
          campaignName: cet.parentCampaign.name,
          tierId: cet.tier.id,
          tierName: cet.tier.name,
          isSet: true,
          value: claim.telegramUsername,
        };
      }
      return {
        campaignId: cet.parentCampaign.id,
        campaignName: cet.parentCampaign.name,
        tierId: cet.tier.id,
        tierName: cet.tier.name,
        isSet: false,
        value: "",
      };
    });
  };

  return (
    <List
      header={"Suscripciones:"}
      dataSource={singleInputFormData}
      renderItem={(d) => (
        <List.Item>
          <Space>
            <span>
              ({d.campaignId}/{d.tierId}) - {d.campaignName} / {d.tierName}
            </span>
            <SingleFormInput
              campaignId={d.campaignId}
              tierId={d.tierId}
              buttonName={"Reclamar ventaja"}
              valueName={"Telegram Username"}
              value={d.value}
              isSet={d.isSet}
              onSubmit={() => onSubmitState}
              onRemove={() => onRemoveState}
            />
          </Space>
        </List.Item>
      )}
    />
  );
};

export default ProfileSubscriptions;
