import { Alert, Button, Checkbox, TextField, FormControlLabel } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useAirdropApi from "../../hooks/useAirdropApi";
import useWallets from "../../hooks/useWallets";
import { AllocationResponse, ClaimAllocationResponse } from "../../models/Api";
import { Chain } from "../../models/Chain";
import { Wallet } from "../../models/Wallet";
import { Loader } from "../Loader";
import DoneAllIcon from "@mui/icons-material/DoneAll"
import "./ClaimAirdrop.scss"

type ClaimAirdropType = {
    wallet: Wallet,
    chain: Chain,
    allocationResponse: AllocationResponse,
    onClaimAirdropSuccessfully: () => void,
    onCheckAnotherWallet: () => void
}

export const ClaimAirdrop = (props: ClaimAirdropType) => {
    const { wallet, chain, onCheckAnotherWallet, onClaimAirdropSuccessfully, allocationResponse } = props;

    const [newTerraAddress, setNewTerraAddress] = useState("");
    const [isValidAccount, setIsValidAccount] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [claimResponse, setClaimResponse] = useState<ClaimAllocationResponse | null>(null);
    const [acceptedWarning, setAcceptedWarning] = useState<boolean>(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { signClaimAllocation, isNewValidAccount, getAddress } = useWallets();
    const { claimAllocation } = useAirdropApi();

    const onChangeAddress = (event: any) => {
        setNewTerraAddress(event.target.value);
        setIsValidAccount(null);
    }
    const onChangeWarning = (event: any) => {
        setAcceptedWarning(event.target.checked)
    }

    const onSignTransaction = async () => {
        setLoading(true);

        const isNew = await isNewValidAccount(newTerraAddress);
        setIsValidAccount(isNew);

        if (isNew) {
            try {
                const { signature, signerAddress } = await signClaimAllocation(wallet, chain, newTerraAddress, allocationResponse);

                try {
                    if(wallet.id === 'station' || wallet.id === 'stationmobile') {
                        setClaimResponse({});
                    }
                    else {
                        const claimResponse = await claimAllocation(
                            chain.id,
                            signerAddress,
                            "uluna",
                            { 
                                new_terra_address: newTerraAddress, 
                                signature 
                            }
                        );
                        setClaimResponse(claimResponse);
                    }

                    onClaimAirdropSuccessfully();
                }
                catch (e : any) {
                    if (e?.response?.data?.message) {
                        setClaimResponse({
                            message: e?.response?.data?.message
                        })
                    }
                    else {
                        setClaimResponse({
                            message: "Something went wrong claiming the airdrop. Try again or"
                        })
                    }
                    
                    enqueueSnackbar("Something went wrong claiming the airdrop. Try again or check discord", { variant: "error" });
                }
            }
            catch (e: any) {
                console.log(e)
                // Happens when the user has switched wallets in Station, but we're using the previous account sequence.
                if (e.toString().includes('account sequence mismatch')) {
                    const address = await getAddress(wallet);
                    enqueueSnackbar(<div style={{ maxWidth: '600px'}} onClick={() => closeSnackbar('wrong-address')}>Unable to submit claim, verify that your active Terra Station wallet address matches the address of the previously connected wallet:<br /><br />{address}</div>, { key: 'wrong-address', variant: "error", persist: true });
                } else {
                    enqueueSnackbar("Something went wrong signing the transaction. Try again or check discord", { variant: "error" });
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="ClaimAirdropWrapper">
            {!loading
                ? <>{claimResponse === null
                    ? <div className="ClaimForm">
                        <h4 className="ClaimAirdropTitle">
                            Enter a Terra address where you'd like to receive your airdrop. This address must be for a new wallet (without previous transactions).
                        </h4>
                        <FormControlLabel
                            label={<h4>I verify this is a new wallet address with no transaction history</h4>}
                            control={<Checkbox onChange={onChangeWarning} checked={acceptedWarning}/>}
                        />
                        <TextField className="ClaimAddressInput"
                            value={newTerraAddress}
                            label="New Terra address"
                            disabled={!acceptedWarning}
                            onChange={onChangeAddress}
                            variant="outlined"
                            error={isValidAccount === false} />

                        {isValidAccount === false && <>
                            <Alert className="ClaimAddressAlert"
                                severity="error">
                                <div>This address is invalid. Make sure it's a new Terra wallet without any transaction history.</div>
                                <a className="AlertLink"
                                    href={`https://docs.terra.money`}
                                    target="_blank"
                                    rel="noreferrer">
                                    <div className="AlertText">How do I make a new wallet?</div>
                                    <div className="icon external-link"></div>
                                </a>
                            </Alert>
                        </>}
                        <Button
                            disabled={!newTerraAddress || isValidAccount === false}
                            variant="contained"
                            onClick={() => onSignTransaction()}>
                            Sign transaction and claim airdrop
                        </Button>
                    </div>
                    : <div className="ClaimAllocationResult">
                        {!claimResponse?.message
                            ? <>
                                <DoneAllIcon className="AllocationIcon success" />
                                <h4>Airdrop claimed, transaction is being broadcasted</h4>
                                <h3>
                                    <a href={`https://finder.terra.money/mainnet/address/${newTerraAddress}`}
                                        target="_blank"
                                        rel="noreferrer"> Check your address in Finder
                                    </a>
                                    <div className="icon external-link"></div>
                                </h3>

                                <Button variant="contained"
                                    fullWidth
                                    onClick={() => onCheckAnotherWallet()}>
                                    Check another address
                                </Button>
                            </>
                            : <>
                                <h4>{claimResponse.message}</h4>
                                <h3>
                                    <a href="https://discord.com/invite/sTmERSFnYW"
                                        target="_blank"
                                        rel="noreferrer">
                                        Check Terra Discord for help
                                    </a>
                                    <div className="icon external-link"></div>
                                </h3>
                            </>
                        }
                    </div>}
                </>
                : <div className="LoadingAllocation">
                    <Loader bottomElement={
                        <>
                            <h4 className="ClaimAirdropTitle" style={{color: 'red'}}>
                                Before you sign this transaction check 
                                that you have custody of the address 
                                to avoid loss of funds.
                            </h4>
                            <h4 className="ClaimAirdropTitle">{newTerraAddress}</h4>
                        </>
                    } />
                </div>}
        </div>
    )
}
