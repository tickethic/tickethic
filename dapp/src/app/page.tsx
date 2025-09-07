// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { InfoList } from "@/components/InfoList";
import { ActionButtonList } from "@/components/ActionButtonList";
import { EventManager } from "@/components/EventManager";
import { TokenBalance } from "@/components/TokenBalance";
import { FoundersMultisigManager } from "@/components/FoundersMultisigManager";
import Image from 'next/image';

export default function Home() {

  return (
    <div className={"pages"}>
      <Image src="/reown.svg" alt="Reown" width={150} height={150} priority />
      <h1>Tickethic</h1>

      <ConnectButton />
      <TokenBalance />
      <ActionButtonList />
      <EventManager />
      <FoundersMultisigManager />
      <div className="advice">
        <p>Welcome on the Tickethic dApp!</p>
      </div>
      <InfoList />
    </div>
  );
}