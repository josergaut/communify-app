import React, { useEffect, useState } from "react";
import { List, Space } from "antd";
import {
  OnRemoveArg,
  OnSubmitArg,
  ProfileCampaignData,
  ProfileCampaignProps,
  ProfileCampaignTier,
} from "../types/types";
import SingleFormInput from "./SingleFormInput";

const ProfileCampaign: React.FC<ProfileCampaignProps> = (
  props: ProfileCampaignProps,
  context,
) => {
  const [onSubmitState, setOnSubmitState] = useState<
    (submit: OnSubmitArg) => void
  >(() => (submit: OnSubmitArg) => {});
  const [onRemoveState, setOnRemoveState] = useState<
    (submit: OnRemoveArg) => void
  >(() => (remove: OnRemoveArg) => {});
  const [data, setData] = useState<ProfileCampaignData | undefined>(undefined);
  useEffect(() => {
    setData(combineCampaignInfo(props));
    setOnSubmitState(props.onSubmit);
    setOnRemoveState(props.onRemove);
  }, [props]);

  const combineCampaignInfo = (
    props: ProfileCampaignProps,
  ): ProfileCampaignData => {
    return {
      campaignId:
        props.campaignInfo.campaignWithChildrenTiers?.campaign.id ?? null,
      campaignName:
        props.campaignInfo.campaignWithChildrenTiers?.campaign.name ?? "",
      tiers: (
        props.campaignInfo.campaignWithChildrenTiers?.childrenTiers ?? []
      ).map((tier): ProfileCampaignTier => {
        const tierImprovement = props.tierImprovements.find(
          (ti) =>
            ti.campaignId ===
              props.campaignInfo.campaignWithChildrenTiers.campaign.id &&
            ti.tierId === tier.id,
        );
        if (tierImprovement) {
          return {
            tierId: tier.id,
            tierName: tier.name,
            isSet: true,
            chatId: tierImprovement.chatId,
          };
        }
        return {
          tierId: tier.id,
          tierName: tier.name,
          isSet: false,
          chatId: "",
        };
      }),
    };
  };

  const campaignHeader = (campaignId: number, campaignName: string) => {
    if (campaignId !== null && campaignName !== "") {
      return campaignId + " - " + campaignName;
    }
    return "";
  };

  if (data) {
    return (
      <List
        header={
          "Tu Campaña: " + campaignHeader(data.campaignId, data.campaignName)
        }
        dataSource={data.tiers}
        renderItem={(t) => (
          <List.Item>
            <Space>
              <span>
                {t.tierId} - {t.tierName}{" "}
              </span>
              <SingleFormInput
                campaignId={data.campaignId}
                tierId={t.tierId}
                buttonName={"Mejorar Tier"}
                valueName={"Telegram Chat Id"}
                value={t.chatId}
                isSet={t.isSet}
                onSubmit={() => onSubmitState}
                onRemove={() => onRemoveState}
              />
            </Space>
          </List.Item>
        )}
      />
    );
  }
  return <></>;
};

export default ProfileCampaign;
