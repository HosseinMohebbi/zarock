'use client';
import { useState, useEffect } from "react";
import {getAllClients, getBankLogos} from "@/services/client/client.service";
import { Client, BankLogo } from "@/services/client/client.types";
import CashForm from "./CashForm";
import CheckForm from "./CheckForm";
import { useParams } from "next/navigation";
import Button from "@/app/components/ui/Button";

export default function AddTransactionPage() {
    const [mode, setMode] = useState<"cash" | "check">("cash");
    const [clients, setClients] = useState<Client[]>([]);
    const [banks, setBanks] = useState<BankLogo[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const { businessId } = useParams();

    useEffect(() => {
        const loadClients = async () => {
            setLoadingClients(true);
            try {
                const data = await getAllClients({ page: 1, pageSize: 200 }, businessId);
                console.log(data);
                setClients(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingClients(false);
            }
        };
        const loadBanks = async () => {
            setLoadingBanks(true);
            try {
                const data = await getBankLogos();
                setBanks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingBanks(false);
            }
        };
        loadClients();
        loadBanks();
    }, [businessId]);

    return (
        <div className="!pt-24">
            <div className="flex justify-center gap-3 !mb-6">
                <Button
                    type="button"
                    label="نقد"
                    onClick={() => setMode("cash")}
                    customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                    ${mode === "cash"
                        ? '!bg-primary !text-primary-foreground'
                        : '!bg-muted !text-muted-foreground'}`}
                />

                <Button
                    type="button"
                    label="چک"
                    onClick={() => setMode("check")}
                    customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                    ${mode === "check"
                        ? '!bg-primary !text-primary-foreground'
                        : '!bg-muted !text-muted-foreground'}`}
                />
            </div>
            
            {mode === "cash" ? (
                <CashForm clients={clients} loadingClients={loadingClients} />
            ) : (
                <CheckForm clients={clients} loadingClients={loadingClients} banks={banks} loadingBanks={loadingBanks} />
            )}
        </div>
    );
}