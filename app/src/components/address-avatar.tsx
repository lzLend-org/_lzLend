import { clsx } from "clsx";
import Blockies from "react-blockies";

interface AddressAvatarProps {
  address: `0x${string}`;
  size?: number;
  className?: string;
}

export const AddressAvatar = ({ address, size = 2.4, className }: AddressAvatarProps) => {
  return (
    <Blockies
      data-testid="avatar"
      seed={address}
      scale={size}
      size={8}
      className={clsx("rounded-full", className)}
    />
  );
};
