import React from "react";

export type OnSubmitArg = {
  campaignId: number;
  tierId: number;
  chatId: string;
};

export type OnRemoveArg = {
  campaignId: number;
  tierId: number;
};

export type SingleFormInputProps = React.RefAttributes<HTMLElement> & {
  campaignId: number;
  tierId: number;
  buttonName: string;
  valueName: string;
  value: string;
  isSet: boolean;
  onSubmit: (submit: OnSubmitArg) => void;
  onRemove: (remove: OnRemoveArg) => void;
};

export type ConnectionDetails = {
  patreonIsConnected: boolean;
};

export type PatreonAccountInfo = {
  email: String;
  fullName: String;
  campaignWithChildrenTiers: CampaignWithChildrenTiers;
  currentlyEntitledTiers: TierWithParentCampaign[];
};

export type Tier = {
  id: number;
  name: string;
};

export type Campaign = {
  id: number;
  name: string;
};

export type CampaignWithChildrenTiers = {
  campaign: Campaign;
  childrenTiers: Tier[];
};

export type TierWithParentCampaign = {
  tier: Tier;
  parentCampaign: Campaign;
};

export type TierImprovement = {
  id: number;
  ownerEmail: string;
  campaignId: number;
  tierId: number;
  chatId: string;
};

export type ProfileCampaignProps = React.RefAttributes<HTMLElement> & {
  campaignInfo: PatreonAccountInfo;
  tierImprovements: TierImprovement[];
  onSubmit: (submit: OnSubmitArg) => void;
  onRemove: (remove: OnRemoveArg) => void;
};

export type ProfileCampaignData = {
  campaignId: number;
  campaignName: string;
  tiers: ProfileCampaignTier[];
};

export type ProfileCampaignTier = {
  tierId: number;
  tierName: string;
  chatId: string;
  isSet: boolean;
};

export type ProfileSubscriptionsProps = React.RefAttributes<HTMLElement> & {
  currentlyEntitledTiers: TierWithParentCampaign[];
  improvementClaims: ImprovementClaim[];
  onSubmit: (submit: OnSubmitArg) => void;
  onRemove: (remove: OnRemoveArg) => void;
};

export type ImprovementClaim = {
  id: number;
  claimerEmail: string;
  campaignId: number;
  tierId: number;
  telegramUsername: string;
};

export type SingleInputFormData = {
  campaignId: number;
  campaignName: string;
  tierId: number;
  tierName: string;
  value: string;
  isSet: boolean;
};
