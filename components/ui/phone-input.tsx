import { Input, InputProps } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import React from "react";
import ReactPhoneNumberInput, {
  Props as ReactPhoneNumberInputProps,
  Country as CountryCode,
  getCountryCallingCode,
  DefaultInputComponentProps,
  FlagProps,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import ReactPhoneNumberInputSimple, {
  Props as ReactPhoneNumberInputSimpleProps,
} from "react-phone-number-input/input";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";

const PhoneInputSimple = React.forwardRef<
  React.ElementRef<typeof ReactPhoneNumberInputSimple>,
  React.ComponentPropsWithoutRef<typeof ReactPhoneNumberInputSimple> &
    ReactPhoneNumberInputSimpleProps<DefaultInputComponentProps>
>(({ className, children, ...props }, ref) => (
  <ReactPhoneNumberInputSimple ref={ref} placeholder="Enter phone number" inputComponent={Input} {...props} />
));
PhoneInputSimple.displayName = "PhoneInputSimple";

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof ReactPhoneNumberInput>,
  React.ComponentPropsWithoutRef<typeof ReactPhoneNumberInput> &
    ReactPhoneNumberInputProps<DefaultInputComponentProps>
>(({ className, children, ...props }, ref) => (
  <ReactPhoneNumberInput
    ref={ref}
    className={cn("flex", className)}
    placeholder="Enter phone number"
    flagComponent={Flag}
    countrySelectComponent={CountrySelect}
    inputComponent={InputCountry}
    {...props}
  />
));
PhoneInput.displayName = "PhoneInput";

const InputCountry = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input {...props} ref={ref} className={cn(props.className, "rounded-s-none rounded-e-lg")} />
));

type CountrySelectItemOption = { label: string; value: CountryCode };

const CountrySelectItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem> & {
    option: CountrySelectItemOption;
    isSelected: boolean;
  }
>(({ className, option, onSelect, isSelected, ...props }, ref) => (
  <CommandItem ref={ref} className={cn("text-sm gap-2", className)} onSelect={onSelect} {...props}>
    <Flag country={option.value} countryName={option.label} />
    <span>{option.label}</span>
    <span className="text-foreground/50">{`+${getCountryCallingCode(option.value)}`}</span>
    <CheckIcon className={`ml-auto h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} />
  </CommandItem>
));

type CountrySelectProps = {
  disabled?: boolean;
  value: CountryCode;
  onChange: (value: CountryCode) => void;
  options: CountrySelectItemOption[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const renderOptions = () => {
    return options
      .filter((x) => x.value)
      .map((option) => (
        <CountrySelectItem
          key={option.value}
          onSelect={() => onChange(option.value)}
          option={option}
          isSelected={option.value === value}
        />
      ));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("rounded-e-none rounded-s-lg pl-3 pr-1 flex gap-1")}
          disabled={disabled}
        >
          <span className="flex items-center truncate">
            <div className="bg-foreground/20 rounded-sm flex w-6 h-4">
              {value && <Flag country={value} countryName={value} />}
            </div>
          </span>
          <CaretSortIcon className={`${disabled ? "hidden" : ""}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>{renderOptions()}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Flag = ({ country, countryName }: FlagProps) => {
  const CountryFlag = flags[country];

  return (
    <span className={"inline object-contain w-6 h-4 overflow-hidden rounded-sm"}>
      {CountryFlag && <CountryFlag title={countryName} />}
    </span>
  );
};

export { PhoneInput, PhoneInputSimple };
