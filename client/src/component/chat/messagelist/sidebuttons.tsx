import * as React from 'react';
import {
  Flex,
  useStyleConfig,
  useStyles,
  Tooltip,
  IconButton
} from '@chakra-ui/react';
import { EllipsisVIcon, SmileIconRegular, ReplyIcon } from '../../icon';

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
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<SmileIconRegular onClick={onSmileClick}/>}  
          />
        </span>
      </Tooltip>
      <Tooltip
        label="Reply"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<ReplyIcon onClick={onReplyClick}/>}
          />
        </span>
      </Tooltip>
      <Tooltip
        label="More"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<EllipsisVIcon onClick={onOptionsClick}/>}
          />
        </span>
      </Tooltip>
    </Flex>
  );
}