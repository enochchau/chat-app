import * as React from 'react';
import {
  Flex,
  IconButton,
  useStyleConfig,
  useStyles,
} from '@chakra-ui/react';
import { EllipsisVIcon, SmileIcon, ReplyIcon } from '../../icon';

interface SideButtonsProps {
  onSmileClick?: React.MouseEventHandler<HTMLButtonElement>
  onReplyClick?: React.MouseEventHandler<HTMLButtonElement>
  onOptionsClick?: React.MouseEventHandler<HTMLButtonElement>
}
export const SideButtons = ({onSmileClick, onReplyClick, onOptionsClick}: SideButtonsProps) => {
  const styles = useStyleConfig("IconButton", { variant: "sideMsgButton" })
  const flexStyles = useStyles();
  return (
    <Flex
      sx={flexStyles.sideButtons}
    >
      <IconButton
        aria-label="React to message"
        background="none"
        icon={<SmileIcon/>}
        onClick={onSmileClick}
        sx={styles}
      />
      <IconButton
        background="none"
        aria-label="Reply to message"
        icon={<ReplyIcon/>}
        onClick={onReplyClick}
        sx={styles}
      />
      <IconButton
        background="none"
        aria-label="More options"
        icon={<EllipsisVIcon/>}
        onClick={onOptionsClick}
        sx={styles}
      />
    </Flex>
  );
}