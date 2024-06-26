"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

// Define props for the PopoverTrigger component
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

// Define props for the StoreSwitcher component
interface StoreSwitcherProps extends PopoverTriggerProps {
    // items is a list of type store
    items: {
        id: string; 
        name: string; 
        userId: string; 
        createdAt: Date; 
        updatedAt: Date; 
    }[];
}

// StoreSwitcher component
export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps){
    // Use custom hook to manage store modal state
    const storeModal = useStoreModal();
    const params = useParams(); // Get current route parameters
    const router = useRouter(); // Get next/router instance

    // Format store items for rendering
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    // Find the currently selected store
    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    // State to manage popover open/close
    const [open, setOpen] = useState(false);
    
    // Function to handle store selection
    const onStoreSelect = (store: { value: string, label: string}) => {
        setOpen(false); // Close the popover
        router.push(`/${store.value}`) // Navigate to selected store
    }

    // Render the StoreSwitcher component
    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="Select a Store"
                className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..."/>
                        <CommandEmpty>No Store Found</CommandEmpty>
                        <CommandGroup heading="stores">
                            {formattedItems.map((store) => (
                                <CommandItem
                                key={store.value}
                                onSelect={() => onStoreSelect(store)}
                                className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check 
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        currentStore?.value === store.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false)
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
