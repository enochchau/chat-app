import * as React from 'react';
import {
  Flex,
  useStyleConfig,
  useStyles,
} from '@chakra-ui/react';
import { StackedIcon, CircleIcon, EllipsisVIcon, SmileIconRegular, ReplyIcon } from '../../icon';

interface SideButtonsProps {
  onSmileClick?: React.MouseEventHandler<HTMLButtonElement>
  onReplyClick?: React.MouseEventHandler<HTMLButtonElement>
  onOptionsClick?: React.MouseEventHandler<HTMLButtonElement>
}
export const SideButtons = ({onSmileClick, onReplyClick, onOptionsClick}: SideButtonsProps) => {
  const styles = useStyleConfig("Icon", { variant: "sideMsgButton" })
  const parentStyles = useStyles();
  return (
    <Flex sx={parentStyles.sideButtons}>
      <SmileIconRegular sx={styles} onClick={onSmileClick}/>
      <ReplyIcon sx={styles} onClick={onReplyClick}/>
      <EllipsisVIcon sx={styles} onClick={onOptionsClick}/> 
    </Flex>
  );
}