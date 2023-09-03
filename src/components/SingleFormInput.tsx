import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { OnRemoveArg, OnSubmitArg, SingleFormInputProps } from "../types/types";

const SingleFormInput: React.FC<SingleFormInputProps> = ({
  campaignId,
  tierId,
  buttonName,
  valueName,
  value,
  isSet,
  onSubmit,
  onRemove,
}: SingleFormInputProps) => {
  const [campaignIdState, setCampaignIdState] = useState(-1);
  const [tierIdState, setTierIdState] = useState(-1);
  const [isSetState, setIsSetState] = useState(false);
  const [onSubmitState, setOnSubmitState] = useState<
    (submit: OnSubmitArg) => void
  >(() => (submit: OnSubmitArg) => {});
  const [onRemoveState, setOnRemoveState] = useState<
    (submit: OnRemoveArg) => void
  >(() => (remove: OnRemoveArg) => {});
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCampaignIdState(campaignId);
    setTierIdState(tierId);
    setIsSetState(isSet);
    setOnSubmitState(onSubmit);
    setOnRemoveState(onRemove);
    if (isSet) {
      setInputValue(value);
    }
  }, [campaignId, tierId, isSet, value, onSubmit, onRemove]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (inputValue !== "") {
      onSubmitState({
        campaignId: campaignId,
        tierId: tierId,
        chatId: inputValue,
      });
      setIsSetState(true);
    }
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setInputValue("");
    form.resetFields();
    setOpen(false);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value !== "") {
      setInputValue(event.currentTarget.value);
    }
  };

  const handleRemove = () => {
    console.log(onRemoveState);
    onRemoveState({
      campaignId: campaignId,
      tierId: tierId,
    });
    form.resetFields();
    setInputValue("");
    setIsSetState(false);
  };

  return (
    <>
      <Space>
        {isSetState ? (
          <Space>
            <div>
              - {valueName}: {inputValue}
            </div>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            />
          </Space>
        ) : (
          <>
            <Button type="primary" onClick={showModal}>
              {buttonName}
            </Button>
            <Modal
              title={buttonName}
              open={open}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form form={form}>
                <Form.Item
                  name={valueName}
                  label={valueName}
                  rules={[{ required: true }]}
                >
                  <Input value={inputValue} onChange={handleInputChange} />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </Space>
    </>
  );
};

export default SingleFormInput;
