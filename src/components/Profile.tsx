import React, { useEffect, useState } from "react";
import { Button, Divider, List, Space } from "antd";
import useFetchAuthenticated from "../hooks/useFetchAuthenticated";
import ProfileCampaign from "./ProfileCampaign";
import { ImprovementClaim, OnRemoveArg, OnSubmitArg } from "../types/types";
import ProfileSubscriptions from "./ProfileSubscriptions";

type ConnectionDetails = {
  patreonIsConnected: boolean;
};

type PatreonAccountInfo = {
  email: string;
  fullName: string;
  campaignWithChildrenTiers: CampaignWithChildrenTiers;
  currentlyEntitledTiers: TierWithParentCampaign[];
};

type Tier = {
  id: number;
  name: string;
};

type Campaign = {
  id: number;
  name: string;
};

type CampaignWithChildrenTiers = {
  campaign: Campaign;
  childrenTiers: Tier[];
};

type TierWithParentCampaign = {
  tier: Tier;
  parentCampaign: Campaign;
};

type TierImprovement = {
  id: number;
  ownerEmail: string;
  campaignId: number;
  tierId: number;
  chatId: string;
};

const Profile: React.FC = () => {
  const { result, fetchAuthenticated } = useFetchAuthenticated();
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>(
    { patreonIsConnected: false },
  );
  const [patreonAccountInfo, setPatreonAccountInfo] =
    useState<PatreonAccountInfo | null>(null);
  const [tierImprovements, setTierImprovements] = useState<TierImprovement[]>(
    [],
  );
  const [newTierImprovements, setNewTierImprovements] = useState<
    TierImprovement[]
  >([]);
  const [deletedTierImprovements, setDeletedTierImprovements] = useState<
    unknown[]
  >([]);
  const [improvementClaims, setImprovementClaims] = useState<
    ImprovementClaim[]
  >([]);
  const [newImprovementClaims, setNewImprovementClaims] = useState<
    ImprovementClaim[]
  >([]);
  const [deletedImprovementClaims, setDeletedImprovementClaims] = useState<
    unknown[]
  >([]);

  const connectWithPatreonUrl =
    "https://www.patreon.com/oauth2/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id:
        "BuQLpAlV_fOD8JxAoqwlGgePRNtMPCM6XNfyNmWvcDuIx02RmyUjp-BSCht8FRP9",
      redirect_uri: "http://localhost:3000/patreon-redirect",
      scope:
        "identity identity[email] identity.memberships campaigns w:campaigns.webhook campaigns.members",
    });

  useEffect(() => {
    if (result) {
      fetchAuthenticated("http://localhost:8080/private/connection-details")
        .then((response) => response.json())
        .then((data) => {
          setConnectionDetails(data as ConnectionDetails);
        })
        .catch((error) => console.error(error));
    }
  }, [result]);

  useEffect(() => {
    if (result && connectionDetails.patreonIsConnected) {
      fetchAuthenticated("http://localhost:8080/private/patreon/account-info")
        .then((response) => response.json())
        .then((data) => {
          setPatreonAccountInfo(data);
          console.log(data);
        })
        .catch((error) => console.error(error));
    }
  }, [result, connectionDetails?.patreonIsConnected]);

  useEffect(() => {
    if (result && connectionDetails.patreonIsConnected) {
      fetchAuthenticated("http://localhost:8080/private/tier-improvements")
        .then((response) => response.json())
        .then((data) => {
          setTierImprovements(data.tierImprovements);
          console.log(data);
        })
        .catch((error) => console.error(error));
    }
  }, [
    result,
    patreonAccountInfo,
    newTierImprovements,
    deletedTierImprovements,
  ]);

  useEffect(() => {
    if (result && connectionDetails.patreonIsConnected) {
      fetchAuthenticated("http://localhost:8080/private/improvement-claims")
        .then((response) => response.json())
        .then((data) => {
          setImprovementClaims(data.improvementClaims);
          console.log(data);
        })
        .catch((error) => console.error(error));
    }
  }, [
    result,
    patreonAccountInfo,
    newImprovementClaims,
    deletedImprovementClaims,
  ]);

  const handleImproveTierSubmit = (submit: OnSubmitArg) => {
    fetchAuthenticated("http://localhost:8080/private/tier-improvements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submit),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewTierImprovements([...newTierImprovements, data]);
        console.log(data);
      });
  };

  const handleRemoveTierImprovement = (remove: OnRemoveArg) => {
    const deleteUrl =
      "http://localhost:8080/private/tier-improvements?" +
      new URLSearchParams({
        campaignId: remove.campaignId.toString(),
        tierId: remove.tierId.toString(),
      });
    fetchAuthenticated(deleteUrl, {
      method: "DELETE",
    }).finally(() => {
      setDeletedTierImprovements([
        ...deletedTierImprovements,
        {
          campaignId: remove.campaignId,
          tierId: remove.tierId,
        } as unknown,
      ]);
    });
  };

  const handleClaimImprovement = (submit: OnSubmitArg) => {
    fetchAuthenticated("http://localhost:8080/private/improvement-claims", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId: submit.campaignId,
        tierId: submit.tierId,
        telegramUsername: submit.chatId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewImprovementClaims([...newImprovementClaims, data]);
        console.log(data);
      });
  };

  const handleRemoveClaimImprovement = (remove: OnRemoveArg) => {
    const deleteUrl =
      "http://localhost:8080/private/improvement-claims?" +
      new URLSearchParams({
        campaignId: remove.campaignId.toString(),
        tierId: remove.tierId.toString(),
      });
    fetchAuthenticated(deleteUrl, {
      method: "DELETE",
    }).finally(() => {
      setDeletedImprovementClaims([
        ...deletedImprovementClaims,
        {
          campaignId: remove.campaignId,
          tierId: remove.tierId,
        } as unknown,
      ]);
    });
  };

  return (
    <>
      <Space>
        <span>Conectar con Patreon</span>
        {connectionDetails.patreonIsConnected ? (
          <span>✅</span>
        ) : (
          <Button
            type="primary"
            href={connectWithPatreonUrl}
            disabled={connectionDetails.patreonIsConnected}
          >
            Conectar
          </Button>
        )}
      </Space>
      <Divider />
      {patreonAccountInfo === null ? (
        <List header={"Tu Campaña:"}></List>
      ) : (
        <ProfileCampaign
          campaignInfo={patreonAccountInfo}
          tierImprovements={tierImprovements}
          onSubmit={() => handleImproveTierSubmit}
          onRemove={() => handleRemoveTierImprovement}
        />
      )}
      {(patreonAccountInfo?.currentlyEntitledTiers ?? []).length === 0 ? (
        <List header={"Suscripciones:"}></List>
      ) : (
        <ProfileSubscriptions
          currentlyEntitledTiers={
            patreonAccountInfo?.currentlyEntitledTiers ?? []
          }
          improvementClaims={improvementClaims}
          onSubmit={() => handleClaimImprovement}
          onRemove={() => handleRemoveClaimImprovement}
        />
      )}
    </>
  );
};

export default Profile;
