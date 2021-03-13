import * as React from 'react';
import {
  Flex,
  useStyleConfig,
  useStyles,
  Tooltip,
} from '@chakra-ui/react';
import { StackedIcon, CircleIcon, EllipsisVIcon, SmileIconRegular, ReplyIcon } from '../../icon';

interface SideButtonsProps {
  onSmileClick?: React.MouseEventHandler<HTMLButtonElement>
  onReplyClick?: React.MouseEventHandler<HTMLButtonElement>
  onOptionsClick?: React.MouseEventHandler<HTMLButtonElement>
}
export const SideButtons = ({onSmileClick, onReplyClick, onOptionsClick}: SideButtonsProps) => {
  const iconStyles = useStyleConfig("Icon", { variant: "sideMsgButton" })
  const tooltipStyles = useStyleConfig("Tooltip", {variant: "sideMsgButton"})
  const parentStyles = useStyles();
  return (
    <Flex sx={parentStyles.sideButtons}>
      <Tooltip
        label="React"
        placement="top"
        sx={tooltipStyles}
      >
        <span><SmileIconRegular sx={iconStyles} onClick={onSmileClick}/></span>
      </Tooltip>
      <Tooltip
        label="Reply"
        placement="top"
        sx={tooltipStyles}
      >
        <span><ReplyIcon sx={iconStyles} onClick={onReplyClick}/></span>
      </Tooltip>
      <Tooltip
        label="More"
        placement="top"
        sx={tooltipStyles}
      >
        <span><EllipsisVIcon sx={iconStyles} onClick={onOptionsClick}/> </span>
      </Tooltip>
    </Flex>
  );
}